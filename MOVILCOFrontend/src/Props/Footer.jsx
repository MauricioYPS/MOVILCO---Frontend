export default function Footer() {
    return (
        <>
            <footer className="relative mt-auto pt-10 overflow-hidden">
                <div className="red-movilco text-white relative">
                    <div className="max-w-[1600px] mx-auto px-8 py-10 relative z-10">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                            <div className="text-center lg:text-left space-y-2">
                                <div className="flex items-center justify-center lg:justify-start gap-3">
                                    <div className="p-2.5 bg-white/15 rounded-2xl border border-white/20 shadow-inner"></div>
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight leading-none">Movilco</h2>
                                        <span className="text-xs text-white/80 tracking-widest uppercase font-medium">Enterprise Suite</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 pl-1">
                                    <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold text-white border border-white/20">Beta 0.9</span>
                                    <span className="text-[10px] text-white/70 font-mono">Build 2025.12</span>
                                </div>
                            </div>

                            <div className="relative group w-full lg:w-auto">
                                <button
                                    onClick={() => alert("Abriendo instrucciones interactivas...")}
                                    className="relative w-full lg:w-auto flex items-center gap-5 bg-white/10 text-white px-6 py-4 rounded-2xl shadow hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 border border-white/20"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white/20 text-white flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300"></div>
                                    <div className="text-left flex-1">
                                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-white/80 mb-0.5">
                                            Centro de Ayuda
                                        </span>
                                        <span className="block text-base font-bold text-white group-hover:text-white">
                                            Instrucciones de Uso
                                        </span>
                                    </div>
                                    <div className="bg-white/20 p-1.5 rounded-full text-white transition-all duration-300"></div>
                                </button>
                            </div>
                        </div>

                        <div className="h-px bg-white/20 my-8"></div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/80 font-medium">
                            <div className="flex flex-wrap justify-center gap-8">
                                <a href="#" className="group flex items-center gap-2 hover:text-white transition-colors">
                                    <span className="group-hover:underline decoration-white/60 underline-offset-4 decoration-2">Soporte Técnico</span>
                                </a>
                                <a href="#" className="group flex items-center gap-2 hover:text-white transition-colors">
                                    <span className="group-hover:underline decoration-white/60 underline-offset-4 decoration-2">Privacidad</span>
                                </a>
                                <a href="#" className="group flex items-center gap-2 hover:text-white transition-colors">
                                    <span className="group-hover:underline decoration-white/60 underline-offset-4 decoration-2">Dev Team</span>
                                </a>
                            </div>

                            <p className="text-xs opacity-80 text-center md:text-right font-light tracking-wide">
                                © 2025 Movilco S.A.S. — <span className="italic font-normal">Innovación que conecta.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
