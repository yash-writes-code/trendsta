import React from "react";
import { TrendingUp, Menu } from "lucide-react";
import Image from "next/image";
export default function MobileHeader(): React.JSX.Element {
    return (
        <div className="md:hidden flex items-center justify-between p-4 border-b border-blue-100 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <Image src={"/logo3.png"} width={200} height={200} alt="logo" />
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-900">
                <Menu size={24} />
            </button>
        </div>
    );
}
