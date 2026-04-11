/* ================================================================
   customize.js  —  Wallify Custom Poster Engine
   Depends on: data.js (products array) + script.js
   Uses script.js globals: addToCart(), redirectToWhatsApp(),
   formatPrice(), updateCartCount(), getCart()
   WA number must match script.js (919497242251)
================================================================ */

/* ──────────────────────────────────────
   STATE — single source of truth
────────────────────────────────────── */
var custState = {
    imageDataURL: null,
    imageName:    '',
    title:    '',
    subtitle: '',
    quote:    '',
    font:     'Outfit',
    color:    '#ffffff',
    align:    'left',
    position: 'mid-center',
    filter:   'none',
    size:     'A5',
    price:    33,
    quantity: 5,
};

var CUST_SIZES = {
    A6: { price: 17, dim: '105×148mm' },
    A5: { price: 33, dim: '148×210mm' },
    A4: { price: 49, dim: '210×297mm' },
    A3: { price: 99, dim: '297×420mm' },
};

var CUST_OFFERS = [
    { min: 10, free: 3, label: '🎉 Buy 10 Get 3 Free!' },
    { min: 7,  free: 2, label: '🎁 Buy 7 Get 2 Free!' },
    { min: 5,  free: 1, label: '🎀 Buy 5 Get 1 Free!' },
];

/* Position → flex alignment map */
var POS_MAP = {
    'top-left':   { jc: 'flex-start', ai: 'flex-start'  },
    'top-center': { jc: 'flex-start', ai: 'center'       },
    'top-right':  { jc: 'flex-start', ai: 'flex-end'     },
    'mid-left':   { jc: 'center',     ai: 'flex-start'   },
    'mid-center': { jc: 'center',     ai: 'center'       },
    'mid-right':  { jc: 'center',     ai: 'flex-end'     },
    'bot-left':   { jc: 'flex-end',   ai: 'flex-start'   },
    'bot-center': { jc: 'flex-end',   ai: 'center'       },
    'bot-right':  { jc: 'flex-end',   ai: 'flex-end'     },
};

/* ──────────────────────────────────────
   INIT
────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
    setupUpload();
    setupTextInputs();

    document.getElementById('textColor').addEventListener('input', function (e) {
        custState.color = e.target.value;
        document.querySelectorAll('.clr-dot').forEach(function (d) { d.classList.remove('active'); });
        custUpdatePreview();
    });

    custUpdatePricing();
    custUpdatePreview();

    // Modal close on backdrop click
    var modal = document.getElementById('waOrderModal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    // Pre-load product image if ?from=ID in URL
    var urlParams = new URLSearchParams(window.location.search);
    var fromId = urlParams.get('from');
    if (fromId && typeof products !== 'undefined') {
        var p = products.find(function (x) { return x.id === fromId; });
        if (p) {
            if (p.title) {
                document.getElementById('textTitle').value = p.title;
                custState.title = p.title;
            }
            // Attempt to load product image into preview
            custTryLoadProductImage(p.image);
        }
    }
});

function custTryLoadProductImage(src) {
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        try {
            var c = document.createElement('canvas');
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            c.getContext('2d').drawImage(img, 0, 0);
            var dataURL = c.toDataURL('image/jpeg', 0.88);
            custState.imageDataURL = dataURL;
            custState.imageName    = 'product-image.jpg';
            custShowImageInPreview(dataURL);
        } catch (e) {
            /* CORS blocked — user must upload manually */
        }
    };
    img.src = src;
}

/* ──────────────────────────────────────
   UPLOAD
────────────────────────────────────── */
function setupUpload() {
    var zone      = document.getElementById('uploadZone');
    var input     = document.getElementById('imageUpload');
    var removeBtn = document.getElementById('removeImgBtn');

    input.addEventListener('change', function (e) {
        if (e.target.files[0]) custHandleFile(e.target.files[0]);
    });

    zone.addEventListener('dragover', function (e) {
        e.preventDefault(); zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over');
    });
    zone.addEventListener('drop', function (e) {
        e.preventDefault(); zone.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) custHandleFile(e.dataTransfer.files[0]);
    });

    removeBtn.addEventListener('click', function () {
        custState.imageDataURL = null;
        custState.imageName    = '';
        input.value = '';
        document.getElementById('uploadThumb').style.display    = 'none';
        document.getElementById('uploadPrompt').style.display   = '';
        document.getElementById('posterWrap').style.display     = 'none';
        document.getElementById('previewPlaceholder').style.display = '';
        custClearUploadError();
    });
}

function custHandleFile(file) {
    custClearUploadError();
    var allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.indexOf(file.type) === -1) {
        custShowUploadError('Only JPG, PNG, or WEBP images are allowed.');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        custShowUploadError('Image too large. Maximum size is 10 MB.');
        return;
    }
    custState.imageName = file.name;
    var reader = new FileReader();
    reader.onload = function (e) {
        custState.imageDataURL = e.target.result;
        document.getElementById('uploadThumbImg').src = e.target.result;
        document.getElementById('uploadThumb').style.display    = '';
        document.getElementById('uploadPrompt').style.display   = 'none';
        custShowImageInPreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function custShowImageInPreview(dataURL) {
    document.getElementById('posterBg').src = dataURL;
    document.getElementById('previewPlaceholder').style.display = 'none';
    document.getElementById('posterWrap').style.display = '';
    custUpdatePreview();
}

function custShowUploadError(msg) {
    var el = document.getElementById('uploadError');
    el.textContent = msg; el.style.display = 'block';
}
function custClearUploadError() {
    var el = document.getElementById('uploadError');
    if (el) { el.textContent = ''; el.style.display = 'none'; }
}

/* ──────────────────────────────────────
   TEXT INPUTS
────────────────────────────────────── */
function setupTextInputs() {
    var map = { textTitle: 'title', textSub: 'subtitle', textQuote: 'quote' };
    Object.keys(map).forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', function (e) {
            custState[map[id]] = e.target.value;
            custUpdatePreview();
        });
    });
}

/* ──────────────────────────────────────
   CONTROL SETTERS (called from HTML onclick)
────────────────────────────────────── */
function custSetFont(btn, font) {
    custState.font = font;
    document.querySelectorAll('.font-opt').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    custUpdatePreview();
}

function custSetColor(hex, dot) {
    custState.color = hex;
    document.getElementById('textColor').value = hex;
    document.querySelectorAll('.clr-dot').forEach(function (d) { d.classList.remove('active'); });
    if (dot) dot.classList.add('active');
    custUpdatePreview();
}

function custSetAlign(btn, align) {
    custState.align = align;
    document.querySelectorAll('.align-opt').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    custUpdatePreview();
}

function custSetPos(btn, pos) {
    custState.position = pos;
    document.querySelectorAll('.pos-opt').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    custUpdatePreview();
}

function custSetFilter(btn, filter) {
    custState.filter = filter;
    document.querySelectorAll('.filter-opt').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    custUpdatePreview();
}

function custSetSize(btn) {
    custState.size  = btn.dataset.size;
    custState.price = parseInt(btn.dataset.price, 10);
    document.querySelectorAll('.size-opt').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    custUpdatePricing();
}

function custChangeQty(delta) {
    var q = custState.quantity + delta;
    if (q < 5) q = 5;
    custState.quantity = q;
    document.getElementById('custQtyInput').value = q;
    custUpdatePricing();
}

/* ──────────────────────────────────────
   LIVE PREVIEW UPDATE
────────────────────────────────────── */
function custUpdatePreview() {
    var bg        = document.getElementById('posterBg');
    var layer     = document.getElementById('textLayer');
    var titleEl   = document.getElementById('ptTitle');
    var subEl     = document.getElementById('ptSub');
    var quoteEl   = document.getElementById('ptQuote');

    /* Image filter */
    if (bg) bg.style.filter = custState.filter === 'none' ? '' : custState.filter;

    /* Text content */
    if (titleEl) titleEl.textContent = custState.title;
    if (subEl)   subEl.textContent   = custState.subtitle;
    if (quoteEl) quoteEl.textContent = custState.quote;

    /* Font */
    var ff = custState.font + ', serif';
    if (layer) { layer.style.fontFamily = ff; }

    /* Color */
    if (layer) layer.style.color = custState.color;

    /* Text align */
    if (layer) layer.style.textAlign = custState.align;

    /* Position */
    var posMap = POS_MAP[custState.position] || POS_MAP['mid-center'];
    if (layer) {
        layer.style.justifyContent = posMap.jc;
        layer.style.alignItems     = posMap.ai;
    }

    /* Show/hide text layer */
    var hasText = custState.title || custState.subtitle || custState.quote;
    if (layer) layer.style.display = hasText ? 'flex' : 'none';
}

/* ──────────────────────────────────────
   PRICING UPDATE
────────────────────────────────────── */
function custGetOffer(qty) {
    return CUST_OFFERS.find(function (o) { return qty >= o.min; }) || null;
}

function custUpdatePricing() {
    var size  = custState.size;
    var price = custState.price;
    var qty   = custState.quantity;
    var offer = custGetOffer(qty);
    var free  = offer ? offer.free : 0;
    var total = price * qty;

    /* Summary panel */
    var sumUnit  = document.getElementById('sumUnit');
    var sumQtyEl = document.getElementById('sumQtyEl');
    var sumTotal = document.getElementById('sumTotalEl');
    var freeRow  = document.getElementById('sumFreeRow');
    var sumFree  = document.getElementById('sumFreeEl');

    if (sumUnit)  sumUnit.textContent  = '₹' + price;
    if (sumQtyEl) sumQtyEl.textContent = qty;
    if (sumTotal) sumTotal.textContent = '₹' + total;

    if (free > 0 && freeRow && sumFree) {
        freeRow.style.display = '';
        sumFree.textContent   = '+' + free + ' free';
    } else if (freeRow) {
        freeRow.style.display = 'none';
    }

    /* Offer banner in controls */
    var banner = document.getElementById('offerBannerCtrl');
    var strip  = document.getElementById('offerStripPreview');
    var stripTxt = document.getElementById('offerStripText');
    if (offer) {
        if (banner) { banner.textContent = offer.label; banner.style.display = 'block'; }
        if (strip)  { strip.style.display = 'flex'; }
        if (stripTxt) stripTxt.textContent = offer.label;
    } else {
        if (banner) {
            /* hint toward next tier */
            var next = CUST_OFFERS.slice().reverse().find(function (o) { return o.min > qty; });
            if (next) {
                banner.textContent = 'Add ' + (next.min - qty) + ' more → get ' + next.free + ' free!';
                banner.style.display = 'block';
            } else {
                banner.style.display = 'none';
            }
        }
        if (strip) strip.style.display = 'none';
    }

    /* Preview meta */
    var sizeMeta = document.getElementById('previewSizeMeta');
    var qtyMeta  = document.getElementById('previewQtyMeta');
    if (sizeMeta) sizeMeta.textContent = size + ' · ' + CUST_SIZES[size].dim;
    if (qtyMeta)  qtyMeta.textContent  = qty + ' poster' + (qty !== 1 ? 's' : '');
}

/* ──────────────────────────────────────
   ADD TO BAG
────────────────────────────────────── */
function custAddToBag() {
    if (!custState.imageDataURL) {
        custToast('⚠️ Please upload an image first.');
        return;
    }
    if (!custState.title && !custState.subtitle && !custState.quote) {
        custToast('⚠️ Add at least one line of text to your poster.');
        return;
    }

    var orderId = 'CUST-' + Date.now().toString(36).toUpperCase();

    /* Build a product-like object compatible with script.js addToCart:
       addToCart(product, size, frame, unitPrice, qty)  */
    var customProduct = {
        id:    orderId,
        title: (custState.title || 'Custom Poster') + ' [Custom]',
        image: custState.imageDataURL,  /* base64 — shown as thumbnail in cart */
        category: 'Custom',
        basePrice: custState.price,
        isCustom: true,
        designRef: orderId,
    };

    /* Persist full design data so cart.html can reference it */
    custSaveDesign(orderId);

    /* Call existing addToCart from script.js */
    if (typeof addToCart === 'function') {
        addToCart(customProduct, custState.size, 'Custom Print', custState.price, custState.quantity);
    }

    custToast('✅ Added to bag — ' + custState.quantity + ' × ' + custState.size + ' custom poster!');
}

/* ──────────────────────────────────────
   WHATSAPP ORDER
────────────────────────────────────── */
function custOpenWaModal() {
    if (!custState.imageDataURL) { custToast('⚠️ Please upload an image first.'); return; }
    var modal = document.getElementById('waOrderModal');
    if (modal) modal.classList.add('active');
}

function custSubmitWaOrder(e) {
    e.preventDefault();
    var name    = document.getElementById('waName').value.trim();
    var phone   = document.getElementById('waPhone').value.trim();
    var address = document.getElementById('waAddress').value.trim();
    if (!name || !phone || !address) return;

    var offer = custGetOffer(custState.quantity);
    var free  = offer ? offer.free : 0;
    var total = custState.price * custState.quantity;
    var orderId = 'CUST-' + Date.now().toString(36).toUpperCase();
    custSaveDesign(orderId);

    var filterLabel = custState.filter === 'none' ? 'None'
        : custState.filter.includes('grayscale') ? 'B&W'
        : custState.filter.includes('sepia')     ? 'Sepia'
        : custState.filter.includes('1.3')       ? 'Vivid'
        : custState.filter.includes('saturate')  ? 'Punch' : 'Dark';

    var msg =
'🖼️ *CUSTOM POSTER ORDER — Wallify*\n' +
'Order Ref: ' + orderId + '\n\n' +
'📐 *Poster Details*\n' +
'• Type: Custom Design\n' +
'• Size: ' + custState.size + ' (' + CUST_SIZES[custState.size].dim + ')\n' +
'• Quantity: ' + custState.quantity + (free > 0 ? ' (+' + free + ' free)' : '') + '\n' +
'• Unit Price: ₹' + custState.price + '\n' +
'• *Total: ₹' + total + '*\n\n' +
'✏️ *Text Details*\n' +
'• Title: '    + (custState.title    || '—') + '\n' +
'• Subtitle: ' + (custState.subtitle || '—') + '\n' +
'• Quote: '    + (custState.quote    || '—') + '\n' +
'• Font: '     + custState.font + '\n' +
'• Color: '    + custState.color + '\n' +
'• Position: ' + custState.position.replace('-', ' ') + '\n' +
'• Filter: '   + filterLabel + '\n\n' +
'📎 *Image file:* ' + (custState.imageName || 'uploaded-image') + '\n' +
'_(Please also send the image file in this chat)_\n\n' +
'👤 *Customer*\n' +
'• Name: '    + name    + '\n' +
'• Phone: '   + phone   + '\n' +
'• Address: ' + address + '\n\n' +
'Please confirm my order!';

    /* Use redirectToWhatsApp from script.js */
    if (typeof redirectToWhatsApp === 'function') {
        redirectToWhatsApp(msg);
    } else {
        var url = 'https://wa.me/919497242251?text=' + encodeURIComponent(msg);
        window.open(url, '_blank');
    }

    document.getElementById('waOrderModal').classList.remove('active');
}

/* ──────────────────────────────────────
   DESIGN STORAGE (localStorage)
────────────────────────────────────── */
function custSaveDesign(id) {
    var snapshot = {
        id:           id,
        timestamp:    Date.now(),
        imagePreview: custState.imageDataURL,
        imageName:    custState.imageName,
        title:        custState.title,
        subtitle:     custState.subtitle,
        quote:        custState.quote,
        font:         custState.font,
        color:        custState.color,
        align:        custState.align,
        position:     custState.position,
        filter:       custState.filter,
        size:         custState.size,
        price:        custState.price,
        quantity:     custState.quantity,
    };
    try {
        localStorage.setItem('wallifyDesign:' + id, JSON.stringify(snapshot));
        var index = JSON.parse(localStorage.getItem('wallifyDesignIndex') || '[]');
        index.push({ id: id, timestamp: snapshot.timestamp, title: snapshot.title });
        /* Keep last 5 only */
        if (index.length > 5) {
            var old = index.shift();
            localStorage.removeItem('wallifyDesign:' + old.id);
        }
        localStorage.setItem('wallifyDesignIndex', JSON.stringify(index));
    } catch (e) {
        /* Storage full — silently ignore (image data is large) */
    }
}

function custSaveDraft() {
    if (!custState.imageDataURL && !custState.title) { custToast('Nothing to save yet.'); return; }
    try {
        var draft = JSON.parse(JSON.stringify(custState));
        localStorage.setItem('wallifyCustomDraft', JSON.stringify(draft));
        custToast('✅ Draft saved!');
    } catch (e) {
        custToast('⚠️ Storage full — draft not saved.');
    }
}

function custLoadDraft() {
    try {
        var raw = localStorage.getItem('wallifyCustomDraft');
        if (!raw) { custToast('No saved draft found.'); return; }
        var draft = JSON.parse(raw);
        custApplyDraft(draft);
        custToast('✅ Draft loaded!');
    } catch (e) {
        custToast('⚠️ Could not load draft.');
    }
}

function custApplyDraft(d) {
    /* Image */
    if (d.imageDataURL) {
        custState.imageDataURL = d.imageDataURL;
        custState.imageName    = d.imageName || '';
        document.getElementById('uploadThumbImg').src          = d.imageDataURL;
        document.getElementById('uploadThumb').style.display   = '';
        document.getElementById('uploadPrompt').style.display  = 'none';
        custShowImageInPreview(d.imageDataURL);
    }
    /* Text */
    ['title','subtitle','quote'].forEach(function (k) {
        custState[k] = d[k] || '';
    });
    var idMap = { title: 'textTitle', subtitle: 'textSub', quote: 'textQuote' };
    Object.keys(idMap).forEach(function (k) {
        var el = document.getElementById(idMap[k]);
        if (el) el.value = custState[k];
    });
    /* Font */
    custState.font = d.font || 'Outfit';
    document.querySelectorAll('.font-opt').forEach(function (b) {
        b.classList.toggle('active', b.dataset.font === d.font);
    });
    /* Color */
    custSetColor(d.color || '#ffffff', null);
    /* Align */
    custState.align = d.align || 'left';
    document.querySelectorAll('.align-opt').forEach(function (b) {
        b.classList.toggle('active', b.dataset.align === d.align);
    });
    /* Position */
    custState.position = d.position || 'mid-center';
    document.querySelectorAll('.pos-opt').forEach(function (b) {
        b.classList.toggle('active', b.dataset.pos === d.position);
    });
    /* Filter */
    custState.filter = d.filter || 'none';
    document.querySelectorAll('.filter-opt').forEach(function (b) {
        b.classList.toggle('active', b.dataset.filter === d.filter);
    });
    /* Size */
    custState.size  = d.size  || 'A5';
    custState.price = d.price || 33;
    document.querySelectorAll('.size-opt').forEach(function (b) {
        b.classList.toggle('active', b.dataset.size === d.size);
    });
    /* Qty */
    custState.quantity = d.quantity || 5;
    var qi = document.getElementById('custQtyInput');
    if (qi) qi.value = custState.quantity;

    custUpdatePreview();
    custUpdatePricing();
}

/* ──────────────────────────────────────
   RESET
────────────────────────────────────── */
function custReset() {
    if (!confirm('Reset all customization? This cannot be undone.')) return;

    custState = { imageDataURL: null, imageName: '', title: '', subtitle: '', quote: '',
        font: 'Outfit', color: '#ffffff', align: 'left', position: 'mid-center',
        filter: 'none', size: 'A5', price: 33, quantity: 5 };

    ['textTitle','textSub','textQuote'].forEach(function (id) {
        var el = document.getElementById(id); if (el) el.value = '';
    });
    document.getElementById('imageUpload').value = '';
    document.getElementById('textColor').value = '#ffffff';
    document.getElementById('custQtyInput').value = '5';
    document.getElementById('uploadThumb').style.display    = 'none';
    document.getElementById('uploadPrompt').style.display   = '';
    document.getElementById('posterWrap').style.display     = 'none';
    document.getElementById('previewPlaceholder').style.display = '';

    document.querySelectorAll('.font-opt').forEach(function (b)   { b.classList.toggle('active', b.dataset.font   === 'Outfit'); });
    document.querySelectorAll('.align-opt').forEach(function (b)  { b.classList.toggle('active', b.dataset.align  === 'left'); });
    document.querySelectorAll('.pos-opt').forEach(function (b)    { b.classList.toggle('active', b.dataset.pos    === 'mid-center'); });
    document.querySelectorAll('.filter-opt').forEach(function (b) { b.classList.toggle('active', b.dataset.filter === 'none'); });
    document.querySelectorAll('.size-opt').forEach(function (b)   { b.classList.toggle('active', b.dataset.size   === 'A5'); });
    document.querySelectorAll('.clr-dot').forEach(function (d)    { d.classList.toggle('active', d.dataset.color  === '#ffffff'); });

    custClearUploadError();
    custUpdatePreview();
    custUpdatePricing();
    custToast('Design reset.');
}

/* ──────────────────────────────────────
   TOAST
────────────────────────────────────── */
function custToast(msg) {
    var t = document.getElementById('cust-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 3200);
}
