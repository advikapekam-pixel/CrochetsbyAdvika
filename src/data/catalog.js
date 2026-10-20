// ── Product catalog & homepage content (ported from the old site) ──

export const PRODUCTS = [
  { id:1, name:"Sunflower Pot", price:750, originalPrice:null, tag:"BESTSELLER", category:"flowers", img:"/images/sunflower pot.jpg", desc:"A cheerful handcrafted sunflower in a miniature terracotta pot, crocheted with velvety soft yarn. The perfect everlasting sunshine for your work desk or bedside table." },
  { id:2, name:"Sunny Headband", price:350, originalPrice:450, tag:"NEW", category:"headbands", img:"/images/Hairband.jpg", desc:"A sunshine-yellow crochet headband crafted with gentle stretch-cotton yarn. Designed for all-day comfort without pinching behind the ears.", reel:"https://www.instagram.com/p/DWfo48-CSjm/" },
  { id:3, name:"Rabbit Plushie", price:750, originalPrice:null, tag:"SOLD OUT", category:"plushies", img:"/images/Rabbit Plushie.jpg", desc:"A classic amigurumi bunny rabbit with hand-embroidered features and a gently weighted base so it perches upright on shelves.", soldOut:true, reel:"https://www.instagram.com/p/DWJqoAAiUfS/" },
  { id:4, name:"Watermelon Sunglasses Holder", price:800, originalPrice:950, tag:"NEW", category:"accessories", img:"/images/Watermelon Sunglasses Holder.jpg", desc:"A vibrant watermelon-themed sunglasses case with secure button strap. Thick cushioned crochet keeps your lenses safe from scratches in your bag." },
  { id:5, name:"Shiv Dhamru", price:680, originalPrice:null, tag:"", category:"plushies", img:"/images/Shiv Dhamru.jpg", desc:"A traditional spiritual damru crocheted with vibrant yarn and miniature bead details. A sacred keepsake and mindful gift." },
  { id:6, name:"Evil Eye Charm", price:350, originalPrice:null, tag:"NEW", category:"accessories", img:"/images/evil eye charm.jpg", desc:"A protective evil eye charm believed to bring positive energy and ward off negativity. Detailed with sturdy clasp for bags and keys.", reel:"https://www.instagram.com/p/DX9S0mjKxfi/" },
  { id:7, name:"Sunflower Bouquet", price:400, originalPrice:null, tag:"", category:"flowers", img:"/images/sunflower bouquet.jpg", desc:"An everlasting bouquet of crocheted sunflowers wrapped in rustic kraft paper with a satin ribbon. A flower that never withers." },
  { id:8, name:"Colourful Beanie", price:540, originalPrice:620, tag:"BESTSELLER", category:"hats", img:"/images/Beanie.jpg", desc:"A warm, stretchy ribbed crochet beanie in cheerful pastel swirls. Soft, cozy, and made to comfortably fit most adult head sizes." },
  { id:9, name:"Tulip Bag Charm", price:150, originalPrice:null, tag:"NEW", category:"accessories", img:"/images/Tulip Bag Charm.jpg", desc:"A dainty blooming tulip blossom charm with a leafy stem. Clips effortlessly to backpacks, totes, and handbags." },
  { id:10, name:"Teddy Bear Charm", price:500, originalPrice:null, tag:"", category:"plushies", img:"/images/Teddy bear charm.jpg", desc:"A lovable miniature amigurumi teddy bear charm with gentle embroidered face details. Perfect for keys, pouches, or gifting." },
  { id:11, name:"Lilac Bandana", price:350, originalPrice:null, tag:"", category:"headbands", img:"/images/Bandana.jpg", desc:"A dreamy triangular crochet bandana in soothing lilac lace stitch. Comes with long tie ribbons for an adjustable, breezy cottagecore look.", reel:"https://www.instagram.com/p/DXKUUR4iWRR/" },
  { id:12, name:"Floral Earphone Holder", price:200, originalPrice:300, tag:"BESTSELLER", category:"accessories", img:"/images/Floral Earphone Holder.jpg", desc:"A charming floral earphone and cable organizer with snap button closure. Keeps cords completely tangle-free in your bag.", reel:"https://www.instagram.com/p/DOv8QMkic08/" }
];

export const CATEGORIES = ["all","plushies","headbands","hats","accessories","flowers","custom"];
export const COLLECTIONS = [
  { label:"Plushies",   cat:"plushies",   img:"/images/plushie.png" },
  { label:"Headbands",  cat:"headbands",  img:"/images/headbands.png" },
  { label:"Hats",       cat:"hats",       img:"/images/hats.png" },
  { label:"Accessories",cat:"accessories",img:"/images/accessories.png" },
  { label:"Flowers",    cat:"flowers",    img:"/images/flower.png" },
  { label:"Custom",     cat:"custom",     img:"/images/custom.png" }
];

export const TESTIMONIALS = [
  { name:"Riya S.", text:"The strawberry plushie was even softer and cuter than the photos — shipped fast and packed beautifully with a handwritten note!" },
  { name:"Aman K.",  text:"Ordered a custom piece based on a sketch I sent and it came out perfect. Advika kept me updated on WhatsApp the whole time." },
  { name:"Tanvi P.", text:"The bucket hat is so well made — you can tell every stitch was done with care. Already ordered a second one as a birthday gift!" },
  { name:"Meher D.", text:"Bought the headband as a gift and my friend hasn't stopped wearing it. Outstanding handmade quality for the price." }
];

export const FAQS = [
  { q: "How long does it take to make my order?", a: "Every piece is made completely by hand. Standard shop pieces take 3–7 business days to crochet before dispatch. Custom orders take 4–10 days depending on complexity." },
  { q: "How do I pay? Is payment online or on WhatsApp?", a: "To ensure every custom detail and address is confirmed, payment is finalized on WhatsApp! Once your order request is placed, Advika connects with you, confirms the details, and sends her personal UPI QR code (GPay / PhonePe / Paytm)." },
  { q: "Can I request custom colours or sizes?", a: "Yes, absolutely! You can choose custom colours for headbands, beanies, plushies, and bouquets. Just leave a note in your order or select 'Custom Order'." },
  { q: "How do I care for and wash my crochet items?", a: "Hand wash gently in cold water with a gentle detergent. Do not wring or twist. Lay flat on a clean towel in the shade to dry so it retains its exact shape." }
];
