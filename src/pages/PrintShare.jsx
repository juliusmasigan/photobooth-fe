import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import InfoOverlay from '../components/InfoOverlay';
import DesignComposite from '../components/DesignComposite';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const printCopies = parseInt(process.env.REACT_APP_PRINT_COPIES, 10) || 1;

// POSTs JSON and returns the parsed response, throwing the backend's `detail` on failure
const postJson = async (path, body) => {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : `HTTP ${response.status}`);
    }
    return data;
};

const PrintShare = () => {
    const navigate = useNavigate();
    const [infoOpen, setInfoOpen] = useState(false);
    const location = useLocation();
    const { mode, requestId, design, selectedPhotos = [] } = location.state || {};
    // A photo with a videoUrl is shown as a live photo: its clip loops over the still
    const photos = selectedPhotos.map(photo => ({
        image: `${apiBaseUrl}${photo.imageUrl}`,
        video: photo.videoUrl ? `${apiBaseUrl}${photo.videoUrl}` : null
    }));
    const photoKey = selectedPhotos.map(photo => photo.imageUrl).join('|');

    const [printPath, setPrintPath] = useState(null); // /prints/<file>.jpg returned by /api/render
    const [renderError, setRenderError] = useState('');
    const [renderAttempt, setRenderAttempt] = useState(0);
    const [printStatus, setPrintStatus] = useState('idle'); // idle | printing | done | error
    const [printError, setPrintError] = useState('');
    const printUrl = printPath ? `${apiBaseUrl}${printPath}` : null;
    const rendering = Boolean(design) && !printPath && !renderError;

    // Render the print-ready image as soon as the screen opens; its URL drives the QR code and printing
    useEffect(() => {
        if (!design || !photoKey) return;
        let ignore = false;
        setPrintPath(null);
        setRenderError('');

        postJson('/api/render', {
            id: requestId,
            type: mode,
            templateId: design.id,
            photos: photoKey.split('|')
        })
            .then((data) => { if (!ignore) setPrintPath(data.url); })
            .catch((error) => {
                if (ignore) return;
                console.error('Error rendering print:', error);
                setRenderError(error.message);
            });

        return () => {
            ignore = true;
        };
    }, [design, mode, requestId, photoKey, renderAttempt]);

    const handlePrint = async () => {
        if (!printPath) return;
        setPrintStatus('printing');
        setPrintError('');
        try {
            await postJson('/api/print', { url: printPath, copies: printCopies });
            setPrintStatus('done');
        } catch (error) {
            console.error('Error printing:', error);
            setPrintError(error.message);
            setPrintStatus('error');
        }
    };

    return (
        <div className="w-full h-[100dvh] bg-background text-on-surface overflow-hidden flex flex-col">

            {/*  TopAppBar  */}
            <header className="relative shrink-0 w-full flex justify-between items-center px-6 h-16">
                <div className="flex items-center gap-4">
                    <img onClick={() => navigate('/')} src="/SnapGo-dark.png" alt="SnapGo" className="h-9 w-auto" />
                </div>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-white whitespace-nowrap">Print | Share</h1>
                <div className="flex items-center gap-2">
                <button onClick={() => setInfoOpen(true)} className="relative flex items-center justify-center w-11 h-11 text-slate-400 transition-transform active:scale-95 duration-200 rounded-full">
                    <span className="absolute material-symbols-outlined animate-ping">info</span>
                    <span className="absolute material-symbols-outlined">info</span>
                </button>
                </div>
            </header>
            <main className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col landscape:flex-row gap-4 px-4 pb-4 landscape:px-6 landscape:gap-6">
                    {/*  Final Photo Preview Section (takes the remaining space; the design letterboxes inside)  */}
                    <div className="relative flex-1 min-h-0 min-w-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-tertiary/20 rounded-xl blur opacity-25"></div>
                            <div className="relative glass-card rounded-xl overflow-hidden p-3 w-full h-full flex items-center justify-center">
                                {design ? (
                                    <DesignComposite
                                        url={design.url}
                                        imgIds={design.imgIds}
                                        photos={photos}
                                        className="w-full h-full rounded-lg"
                                    />
                                ) : photos[0]?.video ? (
                                    <video className="w-full h-full object-contain rounded-lg shadow-2xl" src={photos[0].video} poster={photos[0].image} autoPlay muted loop playsInline />
                                ) : photos.length > 0 && (
                                    <img alt="Your capture" className="w-full h-full object-contain rounded-lg shadow-2xl" src={photos[0].image} />
                                )}
                            </div>
                    </div>
                    {/*  Action Sidebar: beside the preview in landscape, beneath it in portrait  */}
                    <div className="shrink-0 flex flex-row items-stretch gap-3 landscape:flex-col landscape:justify-center landscape:gap-6 landscape:w-[min(22rem,34vw)]">
                        {/*  QR Download Card  */}
                        <div className="glass-card rounded-xl p-4 landscape:p-6 flex flex-col items-center text-center gap-3 landscape:gap-4 shadow-2xl">
                            <div className="space-y-2">
                                <h3 className="text-base landscape:text-xl font-bold text-white">Scan to Download</h3>
                            </div>
                            <div className="relative p-3 bg-white rounded-xl shadow-inner">
                                <div className="size-[min(12rem,16dvh)] landscape:size-[min(12rem,30dvh)] bg-slate-100 flex items-center justify-center overflow-hidden">
                                    {printUrl ? (
                                    <QRCodeSVG value={printUrl} className="w-full h-full" />
                                    ) : (
                                    /*  Placeholder pattern that mimics a QR code while the print renders  */
                                    <div className={`grid grid-cols-5 gap-1 p-2 w-full h-full opacity-30 ${rendering ? 'animate-pulse' : ''}`}>
                                        <div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                        <div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div>
                                        <div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-black rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-black rounded-sm"></div>
                                    </div>
                                    )}
                                </div>
                                {!printUrl && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-primary p-2 rounded-lg shadow-lg">
                                        <span className="material-symbols-outlined text-white text-2xl" data-icon="qr_code_2">qr_code_2</span>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div className="hidden landscape:block w-full h-px bg-white/10"></div>
                            <div className="hidden landscape:flex items-center gap-3 text-on-surface-variant text-sm font-medium">
                                <span className="material-symbols-outlined text-primary" data-icon="verified_user">verified_user</span>
                                Secure encrypted link
                            </div>
                        </div>
                        {/*  Primary Actions Cluster  */}
                        <div className="flex-1 landscape:flex-none flex flex-col justify-center gap-3">
                            <button
                                onClick={handlePrint}
                                disabled={!printPath || printStatus === 'printing'}
                                className="w-full py-3 landscape:py-4 px-6 text-sm bg-primary-container text-on-primary-container font-bold rounded-xl shadow-lg shadow-primary-container/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
                            >
                                {rendering || printStatus === 'printing' ? (
                                    <span className="material-symbols-outlined animate-spin" data-icon="progress_activity">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined" data-icon="print">print</span>
                                )}
                                {rendering ? 'PREPARING PRINT…'
                                    : printStatus === 'printing' ? 'PRINTING…'
                                    : printStatus === 'done' ? 'PRINT AGAIN'
                                    : 'PRINT HIGH-RES COPY'}
                            </button>
                            <button className="w-full py-3 landscape:py-4 px-6 text-sm glass-card text-on-surface font-semibold rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all border border-white/20">
                                <span className="material-symbols-outlined" data-icon="share">share</span>
                                SHARE TO SOCIALS
                            </button>
                            {(renderError || printError) && (
                                <p className="text-error text-xs text-center leading-snug">
                                    {renderError ? `Couldn't prepare your print: ${renderError}` : `Couldn't print: ${printError}`}
                                    {renderError && (
                                        <button onClick={() => setRenderAttempt(attempt => attempt + 1)} className="ml-2 underline font-semibold">Retry</button>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
            </main>

            <InfoOverlay open={infoOpen} onClose={() => setInfoOpen(false)} />
        </div>
    );
};

export default PrintShare;
