import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import dumpling1 from '../assets/dumpling1.png';
import dumpling2 from '../assets/dumpling2.png';
import dumpling3 from '../assets/dumpling3.png';

const WHATSAPP_NUMBER = "62895383307167";
const PRODUCT_NAME = "Dumpling";
const PRODUCT_PRICE = 12000;
const PRODUCT_DESC = "Dumpling isi ayam, cocok untuk cemilan atau teman makan nasi!";

// Product images/slides
const productImages = [
    { id: 1, image: dumpling1, bg: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #f97316 100%)" },
    { id: 2, image: dumpling2, bg: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)" },
    { id: 3, image: dumpling3, bg: "linear-gradient(135deg, #eab308 0%, #f97316 50%, #ef4444 100%)" }
];

// Confetti component
function Confetti() {
    const [confettiPieces, setConfettiPieces] = useState([]);

    useEffect(() => {
        const pieces = [];
        const colors = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

        for (let i = 0; i < 50; i++) {
            pieces.push({
                id: i,
                x: Math.random() * 100,
                delay: Math.random() * 0.5,
                duration: 2 + Math.random() * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 8 + Math.random() * 8,
                rotation: Math.random() * 360
            });
        }
        setConfettiPieces(pieces);

        const timer = setTimeout(() => {
            setConfettiPieces([]);
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 100,
            overflow: 'hidden'
        }}>
            {confettiPieces.map((piece) => (
                <motion.div
                    key={piece.id}
                    initial={{ x: `${piece.x}vw`, y: -20, rotate: 0, opacity: 1 }}
                    animate={{ y: '110vh', rotate: piece.rotation + 720, opacity: [1, 1, 0] }}
                    transition={{ duration: piece.duration, delay: piece.delay, ease: 'linear' }}
                    style={{
                        position: 'absolute',
                        width: piece.size,
                        height: piece.size,
                        backgroundColor: piece.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px'
                    }}
                />
            ))}
        </div>
    );
}

// Image Carousel Component
function ImageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 1 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 1 })
    };

    const swipeConfidenceThreshold = 5000;
    const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            let next = prev + newDirection;
            if (next < 0) next = productImages.length - 1;
            if (next >= productImages.length) next = 0;
            return next;
        });
    };

    return (
        <div style={{
            position: 'relative',
            height: '23rem',
            overflow: 'hidden',
            background: productImages[currentIndex].bg
        }}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 } }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);
                        if (swipe < -swipeConfidenceThreshold) paginate(1);
                        else if (swipe > swipeConfidenceThreshold) paginate(-1);
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'grab',
                        background: productImages[currentIndex].bg
                    }}
                >
                    <img
                        src={productImages[currentIndex].image}
                        alt="Dumpling Product"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            userSelect: 'none',
                            pointerEvents: 'none'
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem',
                zIndex: 10
            }}>
                {productImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        style={{
                            width: currentIndex === index ? '1.5rem' : '0.5rem',
                            height: '0.5rem',
                            borderRadius: '9999px',
                            backgroundColor: currentIndex === index ? '#fff' : 'rgba(255,255,255,0.5)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* Arrow buttons */}
            <button
                onClick={() => paginate(-1)}
                style={{
                    position: 'absolute',
                    left: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}
            >‹</button>
            <button
                onClick={() => paginate(1)}
                style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                }}
            >›</button>

            {/* Price badge */}
            <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                backgroundColor: '#facc15',
                color: '#111827',
                fontWeight: 'bold',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                boxShadow: '0 10px 25px rgba(250, 204, 21, 0.3)',
                transform: 'rotate(-12deg)',
                zIndex: 10
            }}>Rp {PRODUCT_PRICE.toLocaleString('id-ID')}</div>
        </div>
    );
}

// Input style
const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.75rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none'
};

const labelStyle = {
    display: 'block',
    color: '#d1d5db',
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
    fontWeight: '500'
};

// Order Modal Component
function OrderModal({ isOpen, onClose }) {
    const [jumlah, setJumlah] = useState(1);
    const [nama, setNama] = useState('');
    const [kelas, setKelas] = useState('');
    const [waktuAmbil, setWaktuAmbil] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const url = "https://script.google.com/macros/s/AKfycbxh5QWaPh0YAkUhLblgSSq-CVQALmMPtJFZNMe100rUmkwJjH4dvHJciTBnKfsurKJ8/exec";

        try {
            await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `jumlah=${jumlah}&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&waktu_ambil=${encodeURIComponent(waktuAmbil)}`
            });

            const totalPrice = jumlah * PRODUCT_PRICE;
            const message = encodeURIComponent(
                `Halo! Saya ingin memesan ${PRODUCT_NAME}.\n\n` +
                `📝 Detail Pesanan:\n` +
                `• Nama: ${nama}\n` +
                `• Kelas: ${kelas}\n` +
                `• Jumlah: ${jumlah} pcs\n` +
                `• Total: Rp ${totalPrice.toLocaleString('id-ID')}\n` +
                `• Waktu Ambil: ${waktuAmbil}\n\n` +
                `Terima kasih! 🥟`
            );
            const waUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${message}`;
            window.open(waUrl, '_blank');
            onClose();
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan, silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 50
                }}
            />

            {/* Modal Wrapper */}
            <div style={{
                position: 'fixed',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 51,
                padding: '1rem',
                pointerEvents: 'none'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    style={{
                        width: '100%',
                        maxWidth: '22rem',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        backgroundColor: 'rgba(31, 41, 55, 0.98)',
                        backdropFilter: 'blur(24px)',
                        borderRadius: '1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        padding: '1.5rem',
                        position: 'relative',
                        pointerEvents: 'auto'
                    }}
                >
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '0.75rem',
                            right: '0.75rem',
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >✕</button>

                    <h2 style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#fff',
                        marginBottom: '1.25rem',
                        textAlign: 'center'
                    }}>🥟 Form Pemesanan</h2>

                    <form onSubmit={handleSubmit}>
                        {/* Quantity */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Jumlah</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setJumlah(prev => prev > 1 ? prev - 1 : 1)}
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'rgba(220, 38, 38, 0.3)',
                                        border: '1px solid rgba(220, 38, 38, 0.5)',
                                        color: '#fff',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >−</button>
                                <input
                                    type="text"
                                    value={jumlah}
                                    onChange={(e) => setJumlah(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={{ ...inputStyle, width: '3.5rem', textAlign: 'center', fontWeight: 'bold' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setJumlah(prev => prev + 1)}
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '0.75rem',
                                        backgroundColor: 'rgba(34, 197, 94, 0.3)',
                                        border: '1px solid rgba(34, 197, 94, 0.5)',
                                        color: '#fff',
                                        fontSize: '1.25rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >+</button>
                                <span style={{ marginLeft: 'auto', color: '#facc15', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                    = Rp {(jumlah * PRODUCT_PRICE).toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>

                        {/* Name */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Nama</label>
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Class */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>Kelas</label>
                            <input
                                type="text"
                                value={kelas}
                                onChange={(e) => setKelas(e.target.value)}
                                placeholder="Contoh: XII IPA 1"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Pickup Time */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={labelStyle}>Waktu Ambil</label>
                            <input
                                type="text"
                                value={waktuAmbil}
                                onChange={(e) => setWaktuAmbil(e.target.value)}
                                placeholder="Contoh: Istirahat 1"
                                style={inputStyle}
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: '100%',
                                background: isSubmitting
                                    ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                                    : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                color: '#fff',
                                fontWeight: 'bold',
                                padding: '0.875rem',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 10px 25px rgba(34, 197, 94, 0.3)',
                                border: 'none',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            {isSubmitting ? 'Memproses...' : '✓ Kirim & Buka WhatsApp'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </>
    );
}

export default function ProductPage() {
    const [showConfetti, setShowConfetti] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #450a0a 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {showConfetti && <Confetti />}

            {/* Background orbs */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '-10rem', left: '-10rem',
                    width: '24rem', height: '24rem',
                    backgroundColor: 'rgba(220, 38, 38, 0.2)',
                    borderRadius: '9999px', filter: 'blur(48px)'
                }} />
                <div style={{
                    position: 'absolute', bottom: '-10rem', right: '-10rem',
                    width: '24rem', height: '24rem',
                    backgroundColor: 'rgba(249, 115, 22, 0.15)',
                    borderRadius: '9999px', filter: 'blur(48px)'
                }} />
            </div>

            {/* Product Card */}
            <motion.div
                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
                style={{ width: '100%', maxWidth: '24rem', position: 'relative', zIndex: 10 }}
            >
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(220, 38, 38, 0.1)'
                }}>
                    {/* Image Carousel */}
                    <ImageCarousel />

                    {/* Product Info */}
                    <div style={{ padding: '1.25rem' }}>
                        <motion.h2
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}
                        >{PRODUCT_NAME}</motion.h2>

                        <motion.p
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{ color: '#d1d5db', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}
                        >{PRODUCT_DESC}</motion.p>

                        {/* Order Button */}
                        <motion.button
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowModal(true)}
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                color: '#fff',
                                fontWeight: 'bold',
                                padding: '1rem 2rem',
                                borderRadius: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 10px 25px rgba(220, 38, 38, 0.3)',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.1rem'
                            }}
                        >🛒 Order Sekarang</motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Order Modal */}
            <OrderModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}
