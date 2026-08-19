const CONFIG = {
  // Replace this with your cafe's UPI ID after deployment.
  upiId: "YOURUPI@BANK",
  upiName: "The Brew Station",
  // Optional Google Apps Script web-app URL. Leave blank until backend is deployed.
  orderApi: ""
};

const menu = [
 {cat:"Waffles",items:[
  ["Nutella Waffle",159,179],["Nutella Banana Waffle",159,179],["Nutella Strawberry Waffle",199,219],
  ["Dark Chocolate Waffle",179,199],["White Belgium Waffle",179,199],["White D'erk Waffle",179,199],["Dairy Milk Chocolate Waffle",229,249],["Double Filling Milk Waffle",229,249],["Triple Chocolate Waffle",249,269],
  ["White Oreo Waffle",179,199],["White Biscoff Waffle",199,219],["5 Star Waffle",199,219],["Kit Kat Waffle",199,219],["Snickers Waffle",199,219],["Brownie Waffle",249,269],["Milkbar Waffle",279,299],
  ["Blueberry Filling Waffle",199,219],["Strawberry Filling Waffle",199,219],["Banana Caramel Waffle",249,269],["Ferrero Rocker Waffle",279,299]
 ]},
 {cat:"Hot Brew Vibe",items:[
  ["Espresso Shot (60 ML)",109],["Americano",109],["Cappuccino",129],["Vanilla Latte",129],["Mocha",149],["Nutella Latte",149],["Irish Latte",149],["Caramel Latte",149],["Hazelnut Latte",149],["Biscoff Latte",189]
 ]},
 {cat:"Ice Coffee",items:[
  ["Iced Americano",139],["Iced Cappuccino",139],["Iced Latte",149],["Iced Mocha",169],["Vietnamese Coffee",179],["Iced Nutella Latte",189],["Iced Choco Dark",189]
 ]},
 {cat:"Hot Chocolate",items:[
  ["Brew Hot Chocolate",149],["Hazelnut Hot Chocolate",169],["Irish Hot Chocolate",169],["Mint Hot Chocolate",169],["Dark Hot Chocolate",169],["Espresso Hot Chocolate",179],["Short Bread Hot Chocolate",179],["Nutella Hot Chocolate",179],["Brownie Hot Chocolate",179]
 ]},
 {cat:"Cold Brew",items:[
  ["Cold Brew Tonic",199],["Cold Brew Ginger",199],["Passion Fruit Brew",219],["Cran-Zing Cold Brew",219],["Sweet Citrus Brew",219],["Punchy Peach Cold Brew",219],["Pomegranate Cold Brew",219],["Strawberry Cold Brew",219],["Blueberry Cold Brew",219]
 ]},
 {cat:"Shakes",items:[
  ["Belgian Chocolate",139],["Chocolate Eclair",169],["Chocolate Crumbs",169],["Mandarin Chocolate",169],["Oreo Shake",169],["Mixed Berry",169],["Pineapple Shake",169],["Strawberry Cheesecake",169],["Cranberry Shake",169],["Bubblegum Shake",169],["Blueberry Cheesecake",169],["Black Current",169],["Banana Shake",169],["Nutty Mocha",189],["Irish Mocha",189],["Kitkat Shake",189],["Chocobrowni Shake",189],["Nutella Shake",199],["Biskoffshake",249],["Ferrero Rocher Shake",249],["Dryfruits Shake",249]
 ]},
 {cat:"Brew Frappes",items:[
  ["House Coffee",119],["Cafe Frappe",169],["Caremal Frappe",169],["Hazelnut Frappe",169],["Irish Frappe",169],["Vanilla Frappe",169],["American Bourbon (Whisky)",169],["Caribbean Frappe (Rum)",169],["Tiramisu Frappe",169],["Cocoa Frappe",169],["Cookie Crumble Frappe",189],["Double Chocolate Frappe",189],["Java Chip Frappe",189],["Signature Frappe",189],["Brownie Frappe",199],["Nutella Frappe",199],["Biscoff Frappe",249],["Rocher Frappe",249]
 ]},
 {cat:"Coolers",items:[
  ["Fresh Lime Soda",109],["Lemon Ice Tea",119],["Peach Ice Tea",119],["Passionfruit Ice Tea",119],["Strawberry Ice Tea",119],["Exotic Ice Tea",119],["Classic Mojito",139],["Mint Mojito",139],["Orange Mojito",149],
  ["Cucumber Mojito",159],["Kiwi Mojito",159],["Blue Lagoon",159],["Strawberry Lemonade",159],["Spice Jamun",159],["Blue Berry Lemonade",159],["Cranberry Mojito",159],["Green Apple Mojito",159],["Grenadine Mojito",159]
 ]}
];

let cart = [];
const params = new URLSearchParams(location.search);
const table = params.get("table") || "Counter";
document.getElementById("tablePill").textContent = `Table ${table}`;

function money(n){return "₹"+n.toLocaleString("en-IN")}
function render(){
  const nav=document.getElementById("categories");
  nav.innerHTML=menu.map((c,i)=>`<button class="${i===0?'active':''}" onclick="scrollToCat('${slug(c.cat)}',this)">${c.cat}</button>`).join("");
  document.getElementById("menu").innerHTML=menu.map(c=>`
    <section class="category" id="${slug(c.cat)}">
      <h2>${c.cat}</h2>
      <div class="grid">${c.items.map((x,i)=>{
        const [name,p1,p2]=x;
        const multi=p2!=null;
        return `<article class="item"><h3>${name}</h3>${multi?'<div class="sub">Vanilla base / Brownie base</div>':''}
        <div class="price-row"><div class="price">${multi?money(p1)+' / '+money(p2):money(p1)}</div>
        <button class="add" onclick="addItem('${esc(name)}',${p1},${p2??"null"})">Add</button></div></article>`
      }).join("")}</div>
    </section>`).join("");
}
function slug(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-")}
function esc(s){return s.replaceAll("'","\\'")}
function scrollToCat(id,btn){document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});document.querySelectorAll(".category-nav button").forEach(b=>b.classList.remove("active"));btn.classList.add("active")}
function addItem(name,p1,p2){
  let price=p1, variant="";
  if(p2!=null){const choose=confirm(`${name}\nOK = Vanilla base (${money(p1)})\nCancel = Brownie base (${money(p2)})`); price=choose?p1:p2;variant=choose?"Vanilla base":"Brownie base"}
  const key=name+"|"+variant; const found=cart.find(x=>x.key===key);
  if(found)found.qty++; else cart.push({key,name,price,variant,qty:1});
  updateCart();
}
function updateCart(){
 document.getElementById("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 document.getElementById("cartItems").innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-line"><div><b>${x.name}</b>${x.variant?`<div class="sub">${x.variant}</div>`:''}<div>${money(x.price)} × ${x.qty}</div></div><div class="qty"><button onclick="changeQty(${i},-1)">−</button> <button onclick="changeQty(${i},1)">+</button></div></div>`).join(""):"<p>Your cart is empty.</p>";
 document.getElementById("cartTotal").textContent=money(cart.reduce((a,x)=>a+x.price*x.qty,0));
}
function changeQty(i,d){cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);updateCart()}
function openCart(){document.getElementById("cartDrawer").classList.remove("hidden")}
function closeCart(){document.getElementById("cartDrawer").classList.add("hidden")}
async function placeOrder(){
 if(!cart.length)return alert("Add at least one item.");
 const name=document.getElementById("customerName").value.trim()||"Guest";
 const notes=document.getElementById("notes").value.trim();
 const payment=document.querySelector('input[name="payment"]:checked').value;
 const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
 const order={id:"BS"+Date.now().toString().slice(-6),table,name,notes,payment,total,items:cart.map(x=>({...x})) ,createdAt:new Date().toISOString()};
 if(CONFIG.orderApi){
   try{await fetch(CONFIG.orderApi,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain"},body:JSON.stringify(order)});}catch(e){console.log(e)}
 }
 document.getElementById("successText").innerHTML=`Order <b>#${order.id}</b> for <b>Table ${table}</b> has been recorded.<br>Total: <b>${money(total)}</b>`;
 const box=document.getElementById("upiBox");
 if(payment==="UPI" && CONFIG.upiId!=="YOURUPI@BANK"){
   const upi=`upi://pay?pa=${encodeURIComponent(CONFIG.upiId)}&pn=${encodeURIComponent(CONFIG.upiName)}&am=${total}&cu=INR&tn=${encodeURIComponent("Brew Station "+order.id)}`;
   box.innerHTML=`<a class="primary" style="display:block;text-decoration:none;margin:15px 0" href="${upi}">Open UPI & Pay ${money(total)}</a><p class="small">After payment, return to this page. Keep your UPI transaction reference if the cafe asks for it.</p>`;
 } else if(payment==="UPI"){
   box.innerHTML=`<p class="small">UPI is selected, but the cafe UPI ID has not been configured yet.</p>`;
 } else box.innerHTML=`<p class="small">Please pay ₹${total} at the counter in cash.</p>`;
 cart=[];updateCart();closeCart();document.getElementById("success").classList.remove("hidden");
}
function closeSuccess(){document.getElementById("success").classList.add("hidden")}
render();updateCart();
