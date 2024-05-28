# **Coffee App**


## products

Butun urunleri icerir.

### coffees

Kahvelerin olusturuldugu listelendigi alanlari icerir.

### Create A Coffee

**POST**: _localhost:3000/coffees_

#### Uygulanabilecek bir veri ornegi: (`*` isareti bos birakilmamasi gereken alanlari isaret eder.)

"`
{
    "title": "moinese", `*`
    "category_id": 2, `*`
    "category_title": "Coffee", `*`
    "description": "Best coffee in the city.", 
    "price": 232.33, `*`
    "stock_quantity": 12, `*`
    "origin": "South Africa",
    "roast_level": "Tough",
    "flavor_notes": "Daisy, Vanilla"

}
"`

### Get All Coffees

**GET**: _localhost:3000/coffees_

### Get Coffee By Id

**GET**: _localhost:3000/coffees/:id_

### Update Coffee

**PATCH**: _localhost:3000/coffees/:id_

### Delete Coffee

**DELETE**: _localhost:3000/coffees/:id_


## basket

Urun ile ilgili miktar arttirma/azaltma ya da urunu silme gibi islemlerin yapildigi ,stok bilgisi, toplam tutar gibi degerlerin kontrolunun yapildigi alanlari icerir.

### Create Basket

**POST**: _localhost:3000/basket_

#### Uygulanabilecek bir veri ornegi: (`*` isareti bos birakilmamasi gereken alanlari isaret eder.)

"`
{
    "payment_status": "COMPLETED",
    "lineItems": [ 
        {
            "lineItem_id": 25,
            "product_id": 3, `*`
            "quantity": 2 `*`
        },
        {
            "lineItem_id": 26,
            "product_id": 4, `*`
            "quantity": 1 `*`
        }
    ] `*`
}
"`

### Get Basket By Id

**GET**: _localhost:3000/basket/:id_

### Update Basket

**PATCH**: _localhost:3000/basket/:id_

### Delete Basket

**DELETE**: _localhost:3000/basket/:id_


## checkout

Kupon kodu sorgulama, e-mail adresi girerek mail servisini kullanma islemlerin yapildigi, siparisle ilgili indirimli/indirimsiz tutar bilgisi ve uygulanan indirimlerin goruntulendigi alanlari icerir.

### Get Checkout Details

**POST**: _localhost:3000/checkout_

#### Uygulanabilecek bir veri ornegi: (`*` isareti bos birakilmamasi gereken alanlari isaret eder.)


"`
{
    "basket_id": 28, `*`
    "email": "altugyasindurmus@gmail.com", `*`
    "discount": [
        {
            "coupon_code": "TTN2024TTT001"
        }
    ]
}
"`








