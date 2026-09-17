import React, { useState, useEffect, useRef } from 'react';
import {
    Lock, Check, Loader2, Timer, CreditCard, Mail, ShieldCheck, AlertCircle,
    ArrowLeft, BookOpen, CheckCircle2, Download, Star, Shield, Clock,
    MessageSquare, Package, Truck
} from 'lucide-react';
import { trackMetaEvent } from '../utils/meta-tracking';
import { PagesSlider } from './PagesSlider';

// --- CONFIGURATION ---
const STRIPE_PUBLISHABLE_KEY = "pk_live_51PRJCsGGsoQTkhyv6OrT4zvnaaB5Y0MSSkTXi0ytj33oygsfW3dcu6aOFa9q3dr2mXYTCJErnFQJcOcyuDAsQd4B00lIAdclbB";
const BACKEND_URL = "https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/create-payment-intent";
const PAYPAL_BUSINESS_EMAIL = "design@avada.in";
const PAYPAL_LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg";

declare global {
    interface Window {
        Stripe?: (key: string) => any;
    }
}

const WHO_IS_THIS_FOR = [
    { label: 'Homeowners', icon: '/images/icon-3d-homeowners.png' },
    { label: 'Architecture Students', icon: '/images/icon-3d-students.png' },
    { label: 'Interior Designers', icon: '/images/icon-3d-designers.png' },
    { label: 'Real Estate Developers', icon: '/images/icon-3d-developers.png' },
    { label: 'Renovators', icon: '/images/icon-3d-renovators.png' },
    { label: 'DIY Enthusiasts', icon: '/images/icon-3d-diy.png' },
];

/**
 * HARDCOPY CHECKOUT COMPONENT
 * For physical book orders at $199 with 10-day global delivery.
 */
export const HardcopyCheckoutPage: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Meta InitiateCheckout
    useEffect(() => {
        trackMetaEvent({
            eventName: 'InitiateCheckout',
            value: 199.00,
            currency: 'USD',
            content_name: 'Interior Design System - 6 Book Hardcopy Collection',
            content_ids: ['interior-design-system-6-books-hardcopy'],
            content_type: 'product'
        });
    }, []);

    // --- STATE ---
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [zip, setZip] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isStripeLoaded, setIsStripeLoaded] = useState(false);
    const [viewState, setViewState] = useState<'FORM' | 'PROCESSING' | 'SUCCESS'>('FORM');
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [isVisible, setIsVisible] = useState(true);
    const [hidePayPal, setHidePayPal] = useState(false);
    const [hasAddedPaymentInfo, setHasAddedPaymentInfo] = useState(false);
    const [cardBrand, setCardBrand] = useState('unknown');
    const [cardComplete, setCardComplete] = useState({ number: false, expiry: false, cvc: false });
    const [showWalletButton, setShowWalletButton] = useState(false);

    const stripeRef = useRef<any>(null);
    const elementsRef = useRef<any>(null);
    const cardNumberRef = useRef<any>(null);
    const cardExpiryRef = useRef<any>(null);
    const cardCvcRef = useRef<any>(null);
    const paymentRequestRef = useRef<any>(null);

    // --- ENTRANCE ANIMATION ---
    useEffect(() => { requestAnimationFrame(() => setIsVisible(true)); }, []);

    // --- TIMER (synced with landing page via shared localStorage key) ---
    useEffect(() => {
        const DURATION_SECONDS = (7 * 3600) + (37 * 60) + 40;
        const STORAGE_KEY = 'arch_evergreen_deadline_v1';

        const getDeadline = () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            const now = Date.now();
            if (stored) {
                const target = parseInt(stored, 10);
                if (!isNaN(target) && target > now) return target;
            }
            const newDeadline = now + (DURATION_SECONDS * 1000);
            localStorage.setItem(STORAGE_KEY, newDeadline.toString());
            return newDeadline;
        };

        let deadline = getDeadline();

        const calc = () => {
            const now = Date.now();
            let diff = Math.max(0, Math.floor((deadline - now) / 1000));
            if (diff <= 0) {
                deadline = now + (DURATION_SECONDS * 1000);
                localStorage.setItem(STORAGE_KEY, deadline.toString());
                diff = DURATION_SECONDS;
            }
            setTimeLeft({
                h: Math.floor(diff / 3600),
                m: Math.floor((diff % 3600) / 60),
                s: diff % 60
            });
        };

        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, []);

    // --- STRIPE INIT ---
    useEffect(() => {
        initializeStripeUI();
        return () => {
            if (cardNumberRef.current) { try { cardNumberRef.current.destroy(); } catch (e) {} cardNumberRef.current = null; }
            if (cardExpiryRef.current) { try { cardExpiryRef.current.destroy(); } catch (e) {} cardExpiryRef.current = null; }
            if (cardCvcRef.current) { try { cardCvcRef.current.destroy(); } catch (e) {} cardCvcRef.current = null; }
        };
    }, []);

    const initializeStripeUI = async (retry = 0) => {
        try {
            if (!window.Stripe) {
                if (retry < 15) setTimeout(() => initializeStripeUI(retry + 1), 200);
                return;
            }

            const numMount = document.getElementById('card-number-element-hardcopy');
            const expMount = document.getElementById('card-expiry-element-hardcopy');
            const cvcMount = document.getElementById('card-cvc-element-hardcopy');

            if (!numMount || !expMount || !cvcMount) {
                if (retry < 20) setTimeout(() => initializeStripeUI(retry + 1), 100);
                return;
            }

            // Destroy previous elements if any before mounting
            if (cardNumberRef.current) { try { cardNumberRef.current.destroy(); } catch (e) {} cardNumberRef.current = null; }
            if (cardExpiryRef.current) { try { cardExpiryRef.current.destroy(); } catch (e) {} cardExpiryRef.current = null; }
            if (cardCvcRef.current) { try { cardCvcRef.current.destroy(); } catch (e) {} cardCvcRef.current = null; }

            numMount.innerHTML = '';
            expMount.innerHTML = '';
            cvcMount.innerHTML = '';

            const stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
            stripeRef.current = stripe;

            const elements = stripe.elements({
                fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' }],
            });
            elementsRef.current = elements;

            const style = {
                base: {
                    fontFamily: '"Inter", -apple-system, sans-serif',
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#09090b',
                    letterSpacing: '0.01em',
                    lineHeight: '22px',
                    '::placeholder': { color: '#71717a', fontWeight: '400' },
                    iconColor: '#09090b',
                },
                invalid: { color: '#dc2626', iconColor: '#dc2626' },
                complete: { color: '#09090b', iconColor: '#16a34a' },
            };

            // Individual Card Elements (clean options without invalid showIcon)
            const cardNumber = elements.create('cardNumber', { style, placeholder: '1234 1234 1234 1234' });
            const cardExpiry = elements.create('cardExpiry', { style, placeholder: 'MM / YY' });
            const cardCvc = elements.create('cardCvc', { style, placeholder: 'CVC' });

            cardNumber.mount('#card-number-element-hardcopy');
            cardExpiry.mount('#card-expiry-element-hardcopy');
            cardCvc.mount('#card-cvc-element-hardcopy');

            cardNumberRef.current = cardNumber;
            cardExpiryRef.current = cardExpiry;
            cardCvcRef.current = cardCvc;

            cardNumber.on('change', (e: any) => {
                setCardBrand(e.brand || 'unknown');
                setCardComplete(prev => ({ ...prev, number: e.complete }));
                if (e.error) setErrorMessage(e.error.message);
                else setErrorMessage(null);
                if (!e.empty) {
                    setHidePayPal(true);
                    if (!hasAddedPaymentInfo) {
                        trackMetaEvent({
                            eventName: 'AddPaymentInfo',
                            content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                            content_ids: ['interior-design-system-6-books-hardcopy'],
                            content_type: 'product',
                            value: 199.00,
                            currency: 'USD'
                        });
                        setHasAddedPaymentInfo(true);
                    }
                }
            });
            cardExpiry.on('change', (e: any) => {
                setCardComplete(prev => ({ ...prev, expiry: e.complete }));
                if (e.error) setErrorMessage(e.error.message);
            });
            cardCvc.on('change', (e: any) => {
                setCardComplete(prev => ({ ...prev, cvc: e.complete }));
                if (e.error) setErrorMessage(e.error.message);
            });

            // Apple Pay / Google Pay / Link via Express Checkout Element
            const expressElements = stripe.elements({
                mode: 'payment',
                amount: 19900,
                currency: 'usd',
            });

            const expressCheckout = expressElements.create('expressCheckout', {
                buttonHeight: 48,
                buttonTheme: { applePay: 'black', googlePay: 'black' },
                buttonType: { applePay: 'buy', googlePay: 'buy' },
                layout: { maxColumns: 2, maxRows: 1 },
            });

            expressCheckoutRef.current = expressCheckout;

            const walletMount = document.getElementById('wallet-button-element-hardcopy');
            if (walletMount) {
                walletMount.innerHTML = '';
                expressCheckout.mount('#wallet-button-element-hardcopy');
            }

            expressCheckout.on('ready', (event: any) => {
                console.log('[Stripe Express Checkout Hardcopy] Ready event:', event);
                const methods = event?.availablePaymentMethods;
                if (methods && (methods.applePay || methods.googlePay || methods.link || Object.values(methods).some(Boolean))) {
                    setShowWalletButton(true);
                } else if (event?.availablePaymentMethods !== undefined) {
                    console.log('[Stripe Express Checkout Hardcopy] No payment methods available for this device/browser.');
                }
            });

            expressCheckout.on('loaderror', (event: any) => {
                console.error('[Stripe Express Checkout Hardcopy] Load error:', event);
            });

            expressCheckout.on('confirm', async (ev: any) => {
                try {
                    const payerEmail = ev.billingDetails?.email || email || '';
                    const payerName = ev.billingDetails?.name || payerEmail.split('@')[0] || 'Customer';
                    const res = await fetch(BACKEND_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: [{ id: 'hardcopy-bundle' }], email: payerEmail, name: payerName, address: `${address}, ${city}, ${country} ${zip}` })
                    });
                    const { clientSecret } = await res.json();
                    const { error, paymentIntent } = await stripe.confirmPayment({
                        elements: expressElements,
                        clientSecret,
                        confirmParams: { return_url: window.location.origin + '/checkout-hardcopy?success=true' },
                        redirect: 'if_required',
                    });
                    if (error) { setErrorMessage(error.message || 'Payment failed.'); }
                    else if (paymentIntent?.status === 'succeeded') {
                        setEmail(payerEmail);
                        setName(payerName);
                        setViewState('SUCCESS');
                        trackMetaEvent({
                            eventName: 'Purchase',
                            email: payerEmail,
                            value: 199.00,
                            currency: 'USD',
                            content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                            content_ids: ['interior-design-system-6-books-hardcopy'],
                            content_type: 'product',
                            order_id: paymentIntent.id
                        });
                        fetch("https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-mail", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: payerEmail, name: payerName, orderId: paymentIntent.id, isHardcopy: true, address: `${address}, ${city}, ${country} ${zip}` }) }).catch(() => {});
                        setTimeout(() => { window.location.href = "https://drive.google.com/drive/folders/1cVcmiL-fo3o--aA-2YnXTO5UkF_3ERHc"; }, 2500);
                    }
                } catch (err: any) { setErrorMessage(err.message || 'Payment failed.'); }
            });

            setIsStripeLoaded(true);
        } catch (err: any) {
            console.error("Stripe Init Failed:", err);
            setErrorMessage("Card gateway unavailable. Please try PayPal.");
            setIsStripeLoaded(false);
        }
    };

    const handlePaypalSubmit = (e: React.FormEvent) => {
        let hasError = false;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(true); hasError = true; }
        if (!address.trim()) { setAddressError(true); hasError = true; }
        if (hasError) {
            e.preventDefault();
            setErrorMessage("Please fill in your email and shipping address.");
            return;
        }
        if (!hasAddedPaymentInfo) {
            trackMetaEvent({
                eventName: 'AddPaymentInfo',
                content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                content_ids: ['interior-design-system-6-books-hardcopy'],
                content_type: 'product',
                value: 199.00,
                currency: 'USD',
                payment_type: 'paypal'
            });
            setHasAddedPaymentInfo(true);
        }
        setViewState('PROCESSING');
    };

    const handleCardPay = async () => {
        let hasError = false;
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError(true); hasError = true; }
        if (!address.trim()) { setAddressError(true); hasError = true; }
        if (hasError) { setErrorMessage("Please fill in your email and shipping address."); return; }
        if (!cardComplete.number || !cardComplete.expiry || !cardComplete.cvc) { setErrorMessage("Please complete your card details."); return; }
        if (!stripeRef.current || !cardNumberRef.current) {
            setErrorMessage("Payment gateway loading. Please wait a moment.");
            return;
        }
        setViewState('PROCESSING');
        setErrorMessage(null);

        try {
            const customerName = name.trim() || email.split('@')[0] || 'Customer';

            const res = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: [{ id: 'hardcopy-bundle' }], email, name: customerName, address: `${address}, ${city}, ${country} ${zip}` })
            });
            if (!res.ok) {
                if (res.status === 404) throw new Error("Payment server unavailable. Please try PayPal.");
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server error: ${res.status}`);
            }
            const { clientSecret } = await res.json();

            const result = await stripeRef.current.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberRef.current,
                    billing_details: {
                        name: customerName,
                        email,
                        address: {
                            country: 'US',
                            state: 'CA',
                            city: city || 'Los Angeles',
                            line1: address || '123 Main St',
                            postal_code: zip || '90001',
                        },
                    },
                },
                receipt_email: email,
            });

            if (result.error) {
                setErrorMessage(result.error.message || "Payment failed.");
                setViewState('FORM');
            } else if (result.paymentIntent?.status === 'succeeded') {
                setViewState('SUCCESS');
                trackMetaEvent({
                    eventName: 'Purchase',
                    email,
                    value: 199.00,
                    currency: 'USD',
                    content_name: 'Interior Design System - 6 Book Hardcopy Collection',
                    content_ids: ['interior-design-system-6-books-hardcopy'],
                    content_type: 'product',
                    order_id: result.paymentIntent.id
                });
                fetch("https://dhufnozehayzjlsmnvdl.supabase.co/functions/v1/send-book-mail", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, orderId: result.paymentIntent.id, type: 'hardcopy', address: `${address}, ${city}, ${country} ${zip}` })
                }).catch(err => console.error("Email trigger failed:", err));
            }
        } catch (err: any) {
            setErrorMessage(err.message || "An unexpected error occurred.");
            setViewState('FORM');
        }
    };

    const goBack = () => { window.location.href = '/'; };
    const pad = (n: number) => n.toString().padStart(2, '0');

    const inputClass = (hasError: boolean) => `block w-full px-3.5 py-3 bg-white border text-sm rounded-lg transition-all focus:outline-none focus:ring-2 ${hasError
        ? 'border-red-300 focus:ring-red-100 focus:border-red-400'
        : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-400'
    }`;

    // --- RENDER ---
    return (
        <div className={`min-h-screen bg-gray-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                .checkout-container * { font-family: 'Inter', -apple-system, sans-serif; }
                .stripe-input-wrapper { min-height: 24px; }
                #card-number-element-hardcopy, #card-expiry-element-hardcopy, #card-cvc-element-hardcopy { min-height: 24px; width: 100%; }
                .__PrivateStripeElement { width: 100% !important; }
                .__PrivateStripeElement iframe { min-height: 24px !important; }
            `}</style>

            {/* === STICKY TOPBAR (WHITE BACKGROUND, SAME FONT) === */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-xs">
                {/* Header Row */}
                <header className="max-w-5xl mx-auto px-4 sm:px-6 h-13 flex items-center justify-between">
                    <button onClick={goBack} className="flex items-center gap-2 text-sm text-gray-800 hover:text-black font-semibold transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-gray-900" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-gray-950 tracking-tight">Hardcopy Collection</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-900 font-bold">
                        <Lock size={13} className="text-emerald-700" />
                        <span className="hidden sm:inline">Secure Checkout</span>
                    </div>
                </header>

                {/* Sticky Timer Bar on White Background */}
                <div className="border-t border-gray-100 py-2 bg-white flex items-center justify-center gap-2 text-xs font-semibold text-gray-900">
                    <Timer size={13} className="text-gray-900 shrink-0" />
                    <span className="text-gray-800 font-semibold tracking-tight">Offer ends in</span>
                    <span className="font-mono font-black text-gray-950 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded text-xs tracking-wider">
                        {pad(timeLeft.h)}:{pad(timeLeft.m)}:{pad(timeLeft.s)}
                    </span>
                </div>
            </div>

            {/* === MAIN CONTENT === */}
            <div className="checkout-container max-w-5xl mx-auto px-4 sm:px-6 py-4 lg:py-6">

                {/* SUCCESS VIEW */}
                {viewState === 'SUCCESS' && (
                    <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-10 text-center space-y-6">
                        <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30">
                                <Check size={40} className="text-white" strokeWidth={3} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Order Confirmed!</h3>
                            <p className="text-gray-600 text-sm mt-2">Your hardcopy collection will be shipped within 24 hours.</p>
                            <p className="text-gray-500 text-xs mt-1">Estimated delivery: 10 business days worldwide</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-3 text-left">
                                <Truck size={20} className="text-orange-500 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Global Shipping</p>
                                    <p className="text-xs text-gray-600">You'll receive a tracking number via email within 24 hours.</p>
                                </div>
                            </div>
                        </div>
                        <a href="https://wa.me/919198747810" target="_blank" rel="noopener noreferrer"
                            onClick={() => trackMetaEvent({ eventName: 'Contact' })}
                            className="inline-flex items-center gap-2 text-gray-600 text-xs font-semibold hover:text-gray-900 transition-colors">
                            <MessageSquare size={14} /> Need help? WhatsApp us
                        </a>
                    </div>
                )}

                {/* FORM VIEW */}
                {(viewState === 'FORM' || viewState === 'PROCESSING') && (
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">

                        {/* ========== LEFT COLUMN: ORDER SUMMARY ========== */}
                        <div className="flex-1 lg:max-w-[50%]">
                            <div className="lg:sticky lg:top-4">

                                {/* Hardcopy badge */}
                                <div className="flex items-center justify-center gap-2 mb-4 px-4 py-2.5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                                    <Package size={16} className="text-orange-500" />
                                    <span className="text-sm font-bold text-orange-700">Physical Hardcopy Collection</span>
                                    <span className="text-[10px] font-semibold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">PRINTED BOOKS</span>
                                </div>

                                {/* PAGES SLIDER (Book Page Previews) */}
                                <PagesSlider />

                                {/* PREMIUM MOVIE TICKET PASS */}
                                <div className="relative bg-white rounded-2xl border border-gray-300/80 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)]">
                                    {/* Ticket Upper Section (Header & Price) */}
                                    <div className="p-4 sm:p-5 pb-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                                                    6 Hardcopy Books Collection
                                                </h4>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">
                                                    Shipped Globally · Premium Hardcover Edition
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="flex items-baseline justify-end gap-1.5">
                                                    <span className="text-xs text-gray-400 line-through font-semibold">$450</span>
                                                    <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">$199<span className="text-base font-bold text-gray-500">.00</span></span>
                                                </div>
                                                <span className="inline-block mt-0.5 text-[9.5px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                                                    SAVE $251 (56% OFF)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Perforated Tear Line with Semicircular Ticket Notches */}
                                    <div className="relative flex items-center justify-between my-1">
                                        {/* Left Notch */}
                                        <div className="w-3.5 h-7 bg-gray-50 border-r border-y border-gray-300/80 rounded-r-full -ml-[1px]" />
                                        {/* Dashed Line */}
                                        <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2 relative">
                                            <span className="absolute left-1/2 -top-2.5 -translate-x-1/2 bg-white px-2 text-[8.5px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                                                Lifetime Access Pass
                                            </span>
                                        </div>
                                        {/* Right Notch */}
                                        <div className="w-3.5 h-7 bg-gray-50 border-l border-y border-gray-300/80 rounded-l-full -mr-[1px]" />
                                    </div>

                                    {/* Ticket Lower Section (Included Perks) */}
                                    <div className="p-4 sm:p-5 pt-3 bg-gradient-to-b from-[#fafaf9]/80 to-white">
                                        <p className="text-[10.5px] font-extrabold text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                            <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                                <Check size={10} className="text-white" strokeWidth={3} />
                                            </span>
                                            INCLUDED WITH THIS ORDER
                                        </p>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 border border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-orange-100 flex items-center justify-center shrink-0">
                                                        <Package size={13} className="text-orange-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">All 6 Printed Hardcover Books</span>
                                                </div>
                                                <span className="text-[9.5px] font-mono font-bold text-gray-500">800+ PGS</span>
                                            </div>

                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <Truck size={13} className="text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">10-Day Global Tracked Shipping</span>
                                                </div>
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    FREE SHIPPING
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center shrink-0">
                                                        <Download size={13} className="text-emerald-600" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-800">Instant Digital Copies (PDF) Included</span>
                                                </div>
                                                <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    FREE BONUS
                                                </span>
                                            </div>
                                        </div>

                                        {/* Authentic Vector Barcode */}
                                        <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-col items-center">
                                            <svg className="h-6 sm:h-7 w-48 text-gray-800 max-w-full" viewBox="0 0 176 28" fill="currentColor">
                                                <rect x="0" y="0" width="3" height="28"/>
                                                <rect x="5" y="0" width="1.5" height="28"/>
                                                <rect x="9" y="0" width="4" height="28"/>
                                                <rect x="15" y="0" width="2" height="28"/>
                                                <rect x="19" y="0" width="1.5" height="28"/>
                                                <rect x="23" y="0" width="3.5" height="28"/>
                                                <rect x="29" y="0" width="2" height="28"/>
                                                <rect x="33" y="0" width="1" height="28"/>
                                                <rect x="36" y="0" width="4" height="28"/>
                                                <rect x="42" y="0" width="2" height="28"/>
                                                <rect x="46" y="0" width="1.5" height="28"/>
                                                <rect x="50" y="0" width="3" height="28"/>
                                                <rect x="55" y="0" width="4" height="28"/>
                                                <rect x="61" y="0" width="1" height="28"/>
                                                <rect x="64" y="0" width="3" height="28"/>
                                                <rect x="69" y="0" width="2" height="28"/>
                                                <rect x="73" y="0" width="4" height="28"/>
                                                <rect x="79" y="0" width="1.5" height="28"/>
                                                <rect x="83" y="0" width="2" height="28"/>
                                                <rect x="87" y="0" width="3.5" height="28"/>
                                                <rect x="93" y="0" width="1" height="28"/>
                                                <rect x="96" y="0" width="4" height="28"/>
                                                <rect x="102" y="0" width="2" height="28"/>
                                                <rect x="106" y="0" width="1.5" height="28"/>
                                                <rect x="110" y="0" width="3" height="28"/>
                                                <rect x="115" y="0" width="4" height="28"/>
                                                <rect x="121" y="0" width="1.5" height="28"/>
                                                <rect x="125" y="0" width="3" height="28"/>
                                                <rect x="130" y="0" width="2" height="28"/>
                                                <rect x="134" y="0" width="4" height="28"/>
                                                <rect x="140" y="0" width="1" height="28"/>
                                                <rect x="143" y="0" width="3.5" height="28"/>
                                                <rect x="148" y="0" width="2" height="28"/>
                                                <rect x="152" y="0" width="1.5" height="28"/>
                                                <rect x="156" y="0" width="4" height="28"/>
                                                <rect x="162" y="0" width="2" height="28"/>
                                                <rect x="166" y="0" width="1.5" height="28"/>
                                                <rect x="170" y="0" width="3" height="28"/>
                                                <rect x="174" y="0" width="2" height="28"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Details divider (mobile only) */}
                                <div className="flex items-center gap-3 mt-4 lg:hidden">
                                    <div className="flex-1 h-px bg-gray-300" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Billing Details</span>
                                    <div className="flex-1 h-px bg-gray-300" />
                                </div>
                            </div>
                        </div>

                        {/* ========== RIGHT COLUMN: PAYMENT FORM ========== */}
                        <div className="flex-1 lg:max-w-[50%]">
                            {/* Billing Details divider (desktop / laptop) */}
                            <div className="hidden lg:flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Billing Details</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.07)] overflow-hidden">

                                {/* Apple Pay / Google Pay wallet button */}
                                <div className={showWalletButton ? "p-4 sm:p-5 pb-0" : "px-4 sm:px-5"}>
                                    <div id="wallet-button-element-hardcopy" className="mb-1" />
                                    {showWalletButton && (
                                        <div className="flex items-center gap-3 my-2 sm:my-3">
                                            <div className="flex-1 h-px bg-gray-300" />
                                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-600 uppercase tracking-wider">Or pay with card</span>
                                            <div className="flex-1 h-px bg-gray-300" />
                                        </div>
                                    )}
                                </div>

                                <div className="p-5 sm:p-6 space-y-4">

                                    {/* Email */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">Email address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setEmailError(false); setErrorMessage(null); }}
                                            placeholder="you@example.com"
                                            className={`block w-full px-4 py-3.5 bg-white border text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 ${emailError
                                                ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                                                : 'border-gray-300 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400'
                                                }`}
                                        />
                                    </div>

                                    {/* Shipping address */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">Shipping address</label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value); setAddressError(false); setErrorMessage(null); }}
                                                placeholder="Street address"
                                                className={`block w-full px-4 py-3.5 bg-white border text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 ${addressError
                                                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                                                    : 'border-gray-300 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400'
                                                    }`}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    placeholder="City"
                                                    className="block w-full px-4 py-3.5 bg-white border border-gray-300 text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400"
                                                />
                                                <input
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    placeholder="Country"
                                                    className="block w-full px-4 py-3.5 bg-white border border-gray-300 text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={zip}
                                                onChange={(e) => setZip(e.target.value)}
                                                placeholder="ZIP / Postal code"
                                                className="block w-full px-4 py-3.5 bg-white border border-gray-300 text-[15px] font-medium text-gray-950 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-gray-950 focus:border-gray-950 hover:border-gray-400"
                                            />
                                        </div>
                                    </div>



                                    {/* Card number */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-xs font-bold text-gray-950 tracking-wide uppercase">Card number</label>
                                            <div className="flex items-center gap-1.5">
                                                {cardBrand === 'visa' && <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-5" />}
                                                {cardBrand === 'mastercard' && <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-5" />}
                                                {cardBrand === 'amex' && <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-5" />}
                                                {cardBrand === 'unknown' && (
                                                    <div className="flex gap-1 opacity-60">
                                                        <img src="https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg" alt="Visa" className="h-4" />
                                                        <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="MC" className="h-4" />
                                                        <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => cardNumberRef.current?.focus()}
                                            className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                                        >
                                            <div id="card-number-element-hardcopy" className="w-full" />
                                        </div>
                                    </div>

                                    {/* Expiry + CVC row */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">Expiry</label>
                                            <div
                                                onClick={() => cardExpiryRef.current?.focus()}
                                                className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                                            >
                                                <div id="card-expiry-element-hardcopy" className="w-full" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-950 mb-1.5 block tracking-wide uppercase">CVC</label>
                                            <div
                                                onClick={() => cardCvcRef.current?.focus()}
                                                className="border border-gray-300 rounded-xl px-4 py-3.5 hover:border-gray-400 transition-colors focus-within:border-gray-950 focus-within:ring-1 focus-within:ring-gray-950 bg-white cursor-text min-h-[48px] flex items-center"
                                            >
                                                <div id="card-cvc-element-hardcopy" className="w-full" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {errorMessage && (
                                        <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-200">
                                            <AlertCircle size={15} className="shrink-0 text-red-600" />
                                            {errorMessage}
                                        </div>
                                    )}

                                    {/* Pay button */}
                                    <button
                                        onClick={handleCardPay}
                                        disabled={viewState === 'PROCESSING'}
                                        className="w-full py-4 bg-gray-950 hover:bg-black text-white rounded-xl font-bold text-[15px] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.99] mt-2 cursor-pointer"
                                    >
                                        {viewState === 'PROCESSING' ? (
                                            <Loader2 className="animate-spin" size={20} />
                                        ) : (
                                            <><Package size={17} className="text-emerald-400" /><span>Order Hardcopy — $199.00</span></>
                                        )}
                                    </button>

                                    {/* OR divider */}
                                    {!hidePayPal && (
                                        <div className="flex items-center gap-3 pt-1">
                                            <div className="flex-1 h-px bg-gray-300" />
                                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Or</span>
                                            <div className="flex-1 h-px bg-gray-300" />
                                        </div>
                                    )}

                                    {/* PayPal button */}
                                    {!hidePayPal && (
                                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" onSubmit={handlePaypalSubmit}>
                                        <input type="hidden" name="cmd" value="_xclick" />
                                        <input type="hidden" name="business" value={PAYPAL_BUSINESS_EMAIL} />
                                        <input type="hidden" name="item_name" value="Avada Design Bundle - Hardcopy" />
                                        <input type="hidden" name="amount" value="199" />
                                        <input type="hidden" name="currency_code" value="USD" />
                                        <input type="hidden" name="return" value={`${window.location.origin}/success?email=${email}&method=paypal&type=hardcopy`} />
                                        <input type="hidden" name="email" value={email} />
                                        <button
                                            type="submit"
                                            className="w-full py-3.5 bg-[#ffc439] hover:bg-[#f0b72e] text-gray-950 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
                                        >
                                            Pay with <img src={PAYPAL_LOGO_URL} alt="PayPal" className="h-5 object-contain" />
                                        </button>
                                    </form>
                                    )}

                                    {/* Footer */}
                                    <div className="flex items-center justify-center gap-1.5 pt-2 text-xs text-gray-500 font-medium">
                                        <span>Powered by</span>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
