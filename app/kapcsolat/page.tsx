// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { FaTiktok, FaYoutube, FaFacebook, FaDiscord } from "react-icons/fa";
import Image from "next/image";
import {
  ShoppingCart,
  LogIn,
  Menu,
  Check,
  ArrowRight,
  Mail,
  MessageSquare,
  HelpCircle,
  Send,
  ChevronDown,
  Loader2,
  FileText,
  ShieldAlert,
} from "lucide-react";

const useClipboard = (text: string, timeout = 2000) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  return { copied, copy };
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Kezdőlap", href: "/" },
    {
      name: "Szabályzat",
      href: "https://docs.google.com/document/d/1WQIo_5YlT7ZEDDprixxQ7TvMt6EpLIYLLpjkysheDf0",
    },
    { name: "Kapcsolat", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neutral-900/90 backdrop-blur-md border-b border-white/7 py-2"
          : "bg-neutral-900/50 py-4 border-b border-white/5 backdrop-blur-sm"
      }`}
    >
      <nav className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center group cursor-pointer">
          <div className="relative w-12 h-12 mr-3 transition-transform transform group-hover:scale-110 duration-300">
            <Image
              src="/logo.png"
              alt="LegacyMC Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl text-white tracking-wide uppercase">
              <span className="text-amber-500">LegacyMC</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5 space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold uppercase tracking-wider relative group transition-colors ${
                link.name === "Kapcsolat"
                  ? "text-amber-500"
                  : "text-gray-300 hover:text-amber-400"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-amber-500 transition-all duration-300 ${
                  link.name === "Kapcsolat"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              ></span>
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center space-x-3">
          <a
            href="https://shop.legacymc.hu/login"
            className="px-5 py-2.5 text-sm font-bold text-white transition-all bg-neutral-800 rounded-lg hover:bg-neutral-700 border border-neutral-700 flex items-center"
          >
            <LogIn size={16} className="mr-2" />
            Belépés
          </a>
          <a
            href="https://shop.legacymc.hu/"
            className="flex items-center px-5 py-2.5 text-sm font-bold text-neutral-900 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5"
          >
            <ShoppingCart size={16} className="mr-2" />
            Webshop
          </a>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-amber-500"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-neutral-900 border-b border-amber-500/30 overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col p-6 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-200 text-lg font-medium hover:text-amber-500"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-neutral-950 border-t border-white/5 pt-20 pb-10 z-50 relative mt-auto">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-4">
          <div className="flex items-center mb-6">
            <div className="relative w-10 h-10 mr-3">
              <Image
                src="/logo.png"
                alt="LegacyLogo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <span className="font-minecraft font-extrabold text-2xl text-white">
              <span className="text-amber-500">LEGACYMC</span>
            </span>
          </div>
          <p className="text-gray-400 leading-relaxed mb-6 pr-6">
            A LegacyMC elhozza a klasszikus játék élményeket. Építs birodalmat,
            harcolj egy arénában vagy esetleg épitsd fel a bizniszed egy
            blokkon!
          </p>
          <div className="flex space-x-4">
            {[
              { Icon: FaTiktok, url: "https://www.tiktok.com/@legacymchu" },
              { Icon: FaYoutube, url: "https://youtube.com/@mrbarneyy" },
              { Icon: FaFacebook, url: "https://facebook.com/legacymc.hu" },
            ].map(({ Icon, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-neutral-800 transition-all border border-white/5 hover:border-amber-500/30"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-minecraft text-white font-bold mb-6 text-lg">Navigáció</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                Kezdőlap
              </a>
            </li>
            <li>
              <a
                href="https://shop.legacymc.hu"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                Webshop
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="font-minecraft text-white font-bold mb-6 text-lg">Dokumentumok</h4>
          <ul className="space-y-3">
            <li>
              <a
                href="https://docs.google.com/document/d/1WQIo_5YlT7ZEDDprixxQ7TvMt6EpLIYLLpjkysheDf0/edit?usp=sharing"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                Szabályzat
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1B5GyjYMVOnm8sE5YOtYztfAN4mLdCAW9EEPrZJrWQtE/edit?usp=sharing"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                ÁSZF
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1eywfPqP8-OEPkK-SXq4WI75vgxu6ZMHGQqO6xmjJV9w/edit?usp=sharing"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                Adatvédelmi Tájékoztató
              </a>
            </li>
            <li>
              <a
                href="https://docs.google.com/document/d/1A0n3yxIBPo5F6fxXRWzqDAjLOFqusgHna0YBjrC5Ojw/edit?usp=sharing"
                className="text-gray-500 hover:text-amber-500 transition-colors"
              >
                Hibajegy Szabályzat
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-4 bg-[#5865F2] rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <FaDiscord size={140} />
          </div>
          <h4 className="text-white font-bold text-xl mb-2 relative z-10">
            Még nem vagy tag?
          </h4>
          <p className="text-blue-100 text-sm mb-4 relative z-10">
            Csatlakozz 1000+ taghoz a Discord szerverünkön és értesülj a
            frissítésekről azonnal!
          </p>
          <a
            href="https://dc.legacymc.hu"
            className="inline-block px-5 py-2 bg-white text-[#5865F2] font-bold rounded shadow-lg relative z-10 hover:bg-gray-100 transition-colors"
          >
            Csatlakozás
          </a>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-10">
          <p className="m-0">© 2025 LegacyMC. Minden jog fenntartva.</p>
          <a
            href="https://dc.mythiclabs.eu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 border border-white/5"
          >
            <Image
              src="/mythic.png"
              alt="MythicLabs"
              width={45}
              height={16}
              className="object-contain"
            />
          </a>
        </div>
        <p>Not affiliated with Mojang AB.</p>
      </div>
    </div>
  </footer>
);

const FAQItem = ({ question, answer, isOpen, toggle }) => {
  return (
    <div className="border border-white/5 rounded-xl bg-neutral-900/50 overflow-hidden transition-all duration-300 hover:border-amber-500/20">
      <button
        onClick={toggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none group"
      >
        <span
          className={`font-bold text-lg transition-colors ${
            isOpen ? "text-amber-500" : "text-gray-200 group-hover:text-white"
          }`}
        >
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-amber-500" : ""
          }`}
        />
      </button>
      <div
        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-6 opacity-100" : "max-h-0 pb-0 opacity-0"
        }`}
      >
        <p className="text-gray-400 leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </p>
      </div>
    </div>
  );
};

const ContactMethodCard = ({
  icon,
  title,
  value,
  link,
  copyable = false,
  color = "text-amber-500",
}) => {
  const { copied, copy } = useClipboard(value || "");

  const handleAction = () => {
    if (copyable) copy();
  };

  return (
    <div
      onClick={copyable ? handleAction : undefined}
      className={`group relative p-6 bg-neutral-800/40 border border-white/5 rounded-2xl hover:bg-neutral-800/60 transition-all duration-300 ${
        copyable ? "cursor-pointer" : ""
      }`}
    >
      <div className="absolute -inset-px bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <div
            className={`p-3 bg-neutral-900 rounded-lg inline-flex items-center justify-center mb-4 shadow-lg border border-white/5 ${color}`}
          >
            {icon}
          </div>
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">
            {title}
          </h3>
          <p className="text-white font-bold text-lg md:text-xl truncate max-w-[200px] md:max-w-none">
            {value}
          </p>
        </div>
        {copyable && (
          <div className="bg-neutral-900 text-xs px-2 py-1 rounded border border-white/10 text-gray-500 group-hover:text-amber-500 transition-colors">
            {copied ? (
              <span className="flex items-center gap-1 text-green-500">
                <Check size={12} /> MÁSOLVA
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ShieldAlert size={12} className="opacity-0 w-0" /> MÁSOLÁS
              </span>
            )}
          </div>
        )}
        {!copyable && link && (
          <div className="text-gray-500 group-hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </div>
        )}
      </div>
      {link && !copyable && (
        <a
          href={link}
          className="absolute inset-0 z-20"
          target="_blank"
          rel="noreferrer"
          aria-label={title}
        ></a>
      )}
    </div>
  );
};

const InputGroup = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  required,
  icon,
}) => {
  const isTextarea = type === "textarea";
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-300 ml-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative group">
        <div
          className={`absolute left-0 pl-4 pointer-events-none text-gray-500 group-focus-within:text-amber-500 transition-colors flex ${
            isTextarea ? "top-4 items-center" : "inset-y-0 items-center"
          }`}
        >
          {icon}
        </div>
        {isTextarea ? (
          <textarea
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            rows="5"
            className="w-full min-h-[160px] bg-neutral-950/50 border border-neutral-700 text-white rounded-xl py-4 pl-14 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-600 resize-none"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full bg-neutral-950/50 border border-neutral-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-600"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "support",
    message: "",
  });
  const [status, setStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState(null);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || "Nem sikerült elküldeni az üzenetet.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "support", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("CONTACT_FORM_SUBMIT_ERROR", error);
      setStatus("error");
      setErrorMessage(error.message || "Ismeretlen hiba történt.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const faqData = [
    {
      q: "Hogyan tudok Unbant szerezni?",
      a: "Unbant kizárólag a webshopunkból tudsz vásárolni.",
    },
    {
      q: "Probléma volt a vásárlással. Mit tegyek?",
      a: "Kérlek, nyiss egy jegyet Discordon a 'Vásárlás' kategóriában, és ird le mi és hogy történt.",
    },
    {
      q: "Jelentkezhetek Staffnak?",
      a: "A Staff jelentkezés időszakos. Ha van felvétel, azt a Discord #staff szobában jelezzük. Ne írj privát üzenetet tulajdonosoknak ezzel kapcsolatban.",
    },
    {
      q: "Nem tudok belépni a szerverre.",
      a: "Ellenőrizd, hogy az IP címet helyesen írtad-e be (play.legacymc.hu), és hogy a verziód 1.18.2 és 1.21.5 közötti-e. Ha 'Auth' probléma van, valószínűleg már regisztrált valaki a neveddel, ilyenkor válassz másik nevet.",
    },
  ];

  return (
    <div className="bg-neutral-900 min-h-screen font-[Inter,sans-serif] text-gray-200 flex flex-col">
      <Head>
        <title>Kapcsolat | LegacyMC</title>
      </Head>

      <Navbar />

      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <Image
            src="/back.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-5 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-900"></div>
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[128px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
              <MessageSquare size={14} />
              <span>Kapcsolat & Támogatás</span>
            </div>
            <h1 className="font-minecraft text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
              Lépj velünk <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">
                Kapcsolatba
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Kérdésed van? Hibát találtál? Vagy csak beköszönnél?{" "}
              <br className="hidden md:block" />
              Válassz az alábbi lehetőségek közül, vagy töltsd ki az űrlapot.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <ContactMethodCard
                  icon={<FaDiscord size={24} />}
                  title="Discord Közösség"
                  value="dc.legacymc.hu"
                  link="https://dc.legacymc.hu"
                  color="text-[#5865F2]"
                />
                <ContactMethodCard
                  icon={<Mail size={24} />}
                  title="Hivatalos Email"
                  value="info@legacymc.hu"
                  copyable={true}
                  color="text-amber-500"
                />
                <ContactMethodCard
                  icon={<FaYoutube size={24} />}
                  title="Tartalomgyártóknak"
                  value="info@legacymc.hu"
                  copyable={true}
                  color="text-red-500"
                />
              </div>

              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 rounded-2xl p-8 relative overflow-hidden mt-8 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl"></div>

                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                  <ShieldAlert className="text-amber-500" size={20} />
                  Azonnali Segítség
                </h3>
                <p className="text-gray-400 text-sm mb-6 relative z-10 leading-relaxed">
                  A Discord szerverünkön nyitott hibajegyekre átlagosan{" "}
                  <strong>30 percen belül</strong> válaszolunk napközben.
                </p>
                <a
                  href="https://dc.legacymc.hu"
                  className="block w-full py-3 bg-[#5865F2] hover:bg-[#4752c4] text-white text-center rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/20 relative z-10"
                >
                  Hibajegy Nyitása
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 relative shadow-2xl">
                {status === "success" ? (
                  <div className="absolute inset-0 z-50 bg-neutral-900 rounded-3xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 ring-4 ring-green-500/10">
                      <Check size={40} strokeWidth={4} />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      Üzenet Elküldve!
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Köszönjük a megkeresést! Kollégáink hamarosan feldolgozzák
                      az üzenetedet.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold transition-colors"
                    >
                      Új üzenet küldése
                    </button>
                  </div>
                ) : null}

                <div className="mb-8">
                  <h2 className="font-minecraft text-2xl font-bold text-white">
                    Email küldése
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Töltsd ki az alábbi űrlapot, ha nincs Discordod.
                  </p>
                </div>

                {status === "error" && errorMessage ? (
                  <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {errorMessage}
                  </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup
                      label="Felhasználónév"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Wilson"
                      required={true}
                      icon={<LogIn size={18} />}
                    />
                    <InputGroup
                      label="Email Cím"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="info@legacymc.hu"
                      required={true}
                      icon={<Mail size={18} />}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 ml-1 uppercase tracking-wide">
                      Kategória
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <HelpCircle size={18} />
                      </div>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-950/50 border border-neutral-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none cursor-pointer"
                      >
                        <option value="support">Általános kérdés</option>
                        <option value="bug">Hiba jelentés</option>
                        <option value="ban">Kitiltás</option>
                        <option value="shop">Webshop probléma</option>
                        <option value="media">Videós együttműködés</option>
                        <option value="egyeb">Egyéb</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <InputGroup
                    label="Üzenet"
                    type="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Írd le a problémádat..."
                    required={true}
                    icon={<FileText size={18} />}
                  />

                  <button
                    disabled={status === "loading"}
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.23)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 group"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        KÜLDÉS...
                      </>
                    ) : (
                      <>
                        KÜLDÉS
                        <Send
                          size={18}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-24 max-w-4xl mx-auto mb-24">
            <h2 className="font-minecraft text-3xl font-black text-white text-center mb-10 uppercase flex flex-col items-center">
              Gyakori Kérdések
              <span className="w-16 h-1 bg-amber-500 rounded mt-3"></span>
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.q}
                  answer={item.a}
                  isOpen={activeFAQ === index}
                  toggle={() =>
                    setActiveFAQ(activeFAQ === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
