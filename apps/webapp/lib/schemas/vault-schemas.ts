import { z } from 'zod';

/**
 * Schema for deposit form validation
 * Validates wBTC deposit amounts with minimum requirements
 */
export const depositFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Amount must be greater than 0',
      }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0.000001; // Minimum deposit amount
      },
      {
        message: 'Minimum deposit amount is 0.000001 wBTC',
      }
    ),
});

export type DepositFormValues = z.infer<typeof depositFormSchema>;

/**
 * Schema for withdraw form validation
 * Validates wBTC withdraw amounts with minimum requirements
 */
export const withdrawFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      {
        message: 'Amount must be greater than 0',
      }
    )
    .refine(
      (val) => {
        const num = parseFloat(val);
        return num >= 0.000001; // Minimum withdraw amount
      },
      {
        message: 'Minimum withdraw amount is 0.000001 wBTC',
      }
    ),
});

export type WithdrawFormValues = z.infer<typeof withdrawFormSchema>;

