// Vault con integración a Vesu, configurado para emitir rbBTC como representación de participación

#[starknet::contract]
mod btc_vault {
    use starknet::{ContractAddress, get_contract_address, get_caller_address};
    use array::ArrayTrait;
    use traits::Into;
    use core::serde::Serde;

    // ==============
    // IERC20 interface
    // ==============
    #[starknet::interface]
    trait IERC20<T> {
        fn transfer_from(self: @T, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
        fn transfer(self: @T, recipient: ContractAddress, amount: u256) -> bool;
    }

    // ===============
    // rbBTC interface
    // ===============
    #[starknet::interface]
    trait IrbBTC<T> {
        fn mint(self: @T, to: ContractAddress, amount: u256);
        fn burn(self: @T, from: ContractAddress, amount: u256);
    }

    // =====================
    // Vesu: Singleton interface
    // =====================
    #[derive(Drop, Copy, Serde)]
    struct Amount {
        value: u256,
        is_negative: bool,
    }

    #[derive(Drop, Serde)]
    struct ModifyPositionParams {
        pool_id: felt252,
        collateral_asset: ContractAddress,
        debt_asset: ContractAddress,
        user: ContractAddress,
        collateral: Amount,
        debt: Amount,
        data: Array<felt252>,
    }

    #[starknet::interface]
    trait ISingleton<T> {
        fn modify_position(self: @T, params: ModifyPositionParams);
        fn position(self: @T, pool_id: felt252, collateral_asset: ContractAddress, debt_asset: ContractAddress, user: ContractAddress) -> ((), u256, u256);
    }

    // ====================
    // Vault storage
    // ====================
    #[storage]
    struct Storage {
        wbtc_token: ContractAddress,
        pool_id: felt252,
        singleton: ContractAddress,
        rb_token: ContractAddress,
        user_balances: LegacyMap<ContractAddress, u256>,
    }

    // =====================
    // Eventos
    // =====================
    #[event]
    #[derive(Drop, starknet::Event)]
    struct Event {
        user: ContractAddress,
        amount: u256
    }

    // ================
    // Constructor
    // ================
    #[constructor]
    fn constructor(
        ref self: ContractState,
        wbtc_token: ContractAddress,
        pool_id: felt252,
        singleton: ContractAddress,
        rb_token: ContractAddress
    ) {
        self.wbtc_token.write(wbtc_token);
        self.pool_id.write(pool_id);
        self.singleton.write(singleton);
        self.rb_token.write(rb_token);
    }

    // ==============================
    // Depósito al pool de Vesu
    // ==============================
    #[external(v0)]
    fn deposit_to_vesu(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let token_address = self.wbtc_token.read();

        let token = IERC20Dispatcher { contract_address: token_address };
        let success = token.transfer_from(caller, get_contract_address(), amount);
        assert!(success, "transfer-failed");

        let singleton = ISingletonDispatcher {
            contract_address: self.singleton.read()
        };

        let collateral = Amount { value: amount, is_negative: false };
        let debt = Amount { value: 0, is_negative: false };

        let params = ModifyPositionParams {
            pool_id: self.pool_id.read(),
            collateral_asset: token_address,
            debt_asset: token_address,
            user: get_contract_address(),
            collateral,
            debt,
            data: ArrayTrait::new(),
        };

        singleton.modify_position(params);

        // Guardar balance interno y mintear rbBTC
        let old_balance = self.user_balances.read(caller);
        self.user_balances.write(caller, old_balance + amount);

        let rb = IrbBTCDispatcher { contract_address: self.rb_token.read() };
        rb.mint(caller, amount);

        self.emit(Event { user: caller, amount });
    }

    // =========================
    // Retiro de colateral
    // =========================
    #[external(v0)]
    fn withdraw_from_vesu(ref self: ContractState, amount: u256) {
        let caller = get_caller_address();
        let token_address = self.wbtc_token.read();

        let current_balance = self.user_balances.read(caller);
        assert!(current_balance >= amount, "insufficient-balance");
        self.user_balances.write(caller, current_balance - amount);

        let singleton = ISingletonDispatcher {
            contract_address: self.singleton.read()
        };

        let collateral = Amount { value: amount, is_negative: true };
        let debt = Amount { value: 0, is_negative: false };

        let params = ModifyPositionParams {
            pool_id: self.pool_id.read(),
            collateral_asset: token_address,
            debt_asset: token_address,
            user: get_contract_address(),
            collateral,
            debt,
            data: ArrayTrait::new(),
        };

        singleton.modify_position(params);

        let token = IERC20Dispatcher { contract_address: token_address };
        let success = token.transfer(caller, amount);
        assert!(success, "transfer-failed");

        let rb = IrbBTCDispatcher { contract_address: self.rb_token.read() };
        rb.burn(caller, amount);

        self.emit(Event { user: caller, amount });
    }

    // ===============================
    // Consulta de posición del vault
    // ===============================
    #[external(v0)]
    fn get_vault_position(self: @ContractState) -> (u256, u256) {
        let singleton = ISingletonDispatcher {
            contract_address: self.singleton.read()
        };
        let pool_id = self.pool_id.read();
        let asset = self.wbtc_token.read();

        let (_, collateral, debt) = singleton.position(pool_id, asset, asset, get_contract_address());
        (collateral, debt)
    }
} 
