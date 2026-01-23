import React from "react";
import { TrendingUp, Menu } from "lucide-react";
import Image from "next/image";

export default function MobileHeader(): React.JSX.Element {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 bg-white sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-2">
                <Image
                    src={"/logo3.png"}
                    width={150}
                    height={40}
                    alt="logo"
                    style={{ objectFit: 'contain' }}
                />
            </div>
            <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                <Menu size={24} />
            </button>
        </div>
    );
}
