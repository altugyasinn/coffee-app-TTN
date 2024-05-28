export class DiscountLogic {
    public applyDiscountOver3000(total_amount: number): number {
        total_amount *= 0.75;
        return total_amount;
    }

    public applyDiscountOver2000(total_amount: number): number {
        total_amount *= 0.80;
        return total_amount;
    }

    public applyDiscountOver1500(total_amount: number): number {
        total_amount *= 0.85;
        return total_amount;
    }

    public applyDiscountOver1000(total_amount: number): number {
        total_amount *= 0.90;
        return total_amount;
    }

    public applyDiscountCouponCode(amount_to_be_pay: number): number {
        amount_to_be_pay *= 0.90;
        return amount_to_be_pay;
    }
    public applyShippingFee(amount_to_be_pay: number): number {
        if (amount_to_be_pay >= 500) {
            return 0; // Bedava kargo
        } else {
            return amount_to_be_pay += 54.99; // Kargo ucreti
        }
    }
}