if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}
function ready(){
  let toto=document.getElementsByClassName("add")
  for (let index = 0; index < toto.length; index++) {
    toto[index].addEventListener("click",(e)=>{
      let row=document.getElementsByClassName("tbody")[0]
      var tr=document.createElement("tr");
      tr.innerHTML+=
    ` <tr>
            <th scope="row">${e.target.value}</th>
            <td>${e.target.parentElement.parentElement.firstElementChild.nextElementSibling.firstElementChild.innerText}</td>
            <td>${e.target.parentElement.parentElement.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.innerText}</td>
            <td><input type="number" class="form-control" value="1" style="width: 70px;"></td>
            <td><button class="btn btn-danger" value="${e.target.value}">Delete</button></td>
      </tr>`
      row.appendChild(tr)
      let paye=0
      let price=document.getElementById("Price_to_pay");
     let add=document.querySelectorAll("tr");
     for (let index = 1; index < add.length; index++) {
       const element = add[index];
       paye=paye+parseFloat(`${element.children[2].innerText.replace("$",'')}`)
     }
     price.innerText=paye+'$'

     let yoyo=document.getElementsByClassName("btn-danger")
     for (let index = 0; index < yoyo.length; index++) {
        let remove=yoyo[index]
        remove.addEventListener("click",(e)=>{
         remove.parentNode.parentNode.remove();
        
         let paye=0
         let price=document.getElementById("Price_to_pay");
        let add=document.querySelectorAll("tr");
        for (let index = 1; index < add.length; index++) {
          const element = add[index];
          let quantity=element.children[3].children[0].value
          paye=paye+parseFloat(`${element.children[2].innerText.replace("$",'')}`)
        }
        price.innerText=paye+'$'
     })
     }
     let val=document.querySelectorAll(".form-control")
     for (let index = 0; index < val.length; index++) {
       val[index].addEventListener("change",(e)=>{
        let paye=0
        let price=document.getElementById("Price_to_pay");
        let add=document.querySelectorAll("tr");
        for (let index = 1; index < add.length; index++) {
          const element = add[index];
          let quantity=element.children[3].children[0].value
          paye=paye+parseFloat(`${element.children[2].innerText.replace("$",'')}`)*quantity
        }
        price.innerText=paye+'$'
       })
     }
    })
  }
  var stripeHandler = StripeCheckout.configure({
    key:stripePublicKey,
    locale:"auto",
    token:function(token){
       var items=[];
       var select=document.querySelectorAll("tr");
       for (let index = 1; index < select.length; index++) {
        const element = select[index];
        let id=element.children[0].innerText;
        let quantity=element.children[3].children[0].value
        items.push({
          id:id,
          quantity:quantity
      })
       }
     
       fetch('/purchase',{
           method:'POST',
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json'
            },
            body:JSON.stringify({
                stripeTokenId:token.id,
                items:items
            })
       }).then(function(res){
        return res.json()
       }).then(function(data){
        alert(data.message)
        var enlever=document.querySelectorAll("tr");
        for (let index = 1; index < enlever.length; index++) {
           enlever[index].remove()
        }
        document.getElementById("Price_to_pay").innerText="$0.0"
       }).catch(function(err){
        console.log(err)
       })
    }
})
let purchase=document.querySelector(".Purchase");
purchase.addEventListener("click",(e)=>{
  let PriceToPay=parseFloat(document.getElementById("Price_to_pay").innerText.replace("$",""));
  //console.log(PriceToPay)
  stripeHandler.open({
    amount: PriceToPay*100
})
})
}
 