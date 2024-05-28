import { BadRequestException } from '@nestjs/common';

export class CouponCheckLogic {
    public isValidCouponCode(couponCode: string): boolean {

        if (couponCode === null || couponCode === undefined) {
            throw new BadRequestException('Coupon code is required');
        }
        
        couponCode = couponCode.toUpperCase();

        if (couponCode.length < 12) {
            return false;
        }
    
        let t_count = 0;
        let lastDigitIndex = -1;
    
        for (let i = 0; i < couponCode.length; i++) {
            const char = couponCode[i];
        
            if (char === 'T') {
                t_count++;
            } else if (char >= '0' && char <= '9') {
                if (lastDigitIndex !== -1 && i - lastDigitIndex > 1) {
                    // Iki sayi arasinda en az 3 'T' karakteri yoksa gecersiz
                    if (t_count < 3) {
                        return false;
                    }
                    t_count = 0;
                }
                lastDigitIndex = i;
            } else if (char >= 'A' && char <= 'Z') {
                // Diger harfler icin t_count sifirlanmali
                t_count = 0;
            } else {
                // Gecersiz karakter
                return false;
            }
        }
    
        if (lastDigitIndex !== -1 && couponCode.length - lastDigitIndex > 1) {
            if (t_count < 3) {
                return false;
            }
        }
    
        return true;
    }
}