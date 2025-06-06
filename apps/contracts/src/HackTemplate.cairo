use starknet::ContractAddress;

#[starknet::interface]
trait HackTemplateABI<TContractState> {
    fn get_asset_price(self: @TContractState, asset_id: felt252) -> u128;
}

#[starknet::contract]
mod HackTemplate {
    use super::{ContractAddress, HackTemplateABI};
    use starknet::storage::{StoragePointerWriteAccess, StoragePointerReadAccess};
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{DataType, PragmaPricesResponse};

    const ETH_USD: felt252 = 19514442401534788;  //ETH/USD to felt252, can be used as asset_id
    const BTC_USD: felt252 = 18669995996566340;  //BTC/USD

    #[storage]
    struct Storage {
        pragma_contract: ContractAddress,
        summary_stats: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, pragma_address: ContractAddress, summary_stats_address : ContractAddress)
    {
        self.pragma_contract.write(pragma_address);
        self.summary_stats.write(summary_stats_address);
    }

    #[external(v0)]
    impl HackTemplateABIImpl of HackTemplateABI<ContractState> {
        fn get_asset_price(self: @ContractState, asset_id: felt252) -> u128 {
            // Retrieve the oracle dispatcher
            let oracle_dispatcher = IPragmaABIDispatcher {
                contract_address: self.pragma_contract.read()
            };

            // Call the Oracle contract, for a spot entry
            let output: PragmaPricesResponse = oracle_dispatcher
                .get_data_median(DataType::SpotEntry(asset_id));

            return output.price;
        }
    }
}