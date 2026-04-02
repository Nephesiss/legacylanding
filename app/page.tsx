// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { FaTiktok, FaYoutube, FaFacebook, FaDiscord } from "react-icons/fa";
import Image from "next/image";
import {
  ShoppingCart,
  AlertTriangle,
  LogIn,
  Menu,
  User,
  Copy,
  Check,
  Server,
  Sword,
  Pickaxe,
  Users,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Cpu,
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
    {
      name: "Kapcsolat",
      href: "/kapcsolat",
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-neutral-900/90 backdrop-blur-md border-b border-white/10 py-2 transition-colors duration-300 ${
        scrolled ? "shadow-sm shadow-black/20" : ""
      }`}
    >
      <nav className="container mx-auto px-2 flex justify-between items-center">
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
            <span className="font-minecraft font-extrabold text-2xl text-white tracking-wide uppercase drop-shadow-md">
              <span className="text-amber-500">LegacyMC</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              A Csodák Csodája
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center bg-black/30 backdrop-blur-sm px-6 py-2 rounded-full border border-white/5 space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-300 hover:text-amber-400 transition-colors text-sm font-semibold uppercase tracking-wider relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
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
            <Menu size={32} />
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
          <div className="border-t border-gray-800 pt-4 mt-2 flex flex-col space-y-3">
            <a
              href="#"
              className="text-center w-full py-3 bg-neutral-800 text-white rounded font-bold"
            >
              Bejelentkezés
            </a>
            <a
              href="#"
              className="text-center w-full py-3 bg-amber-500 text-neutral-900 rounded font-bold"
            >
              Webshop
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

const StatsStrip = () => {
  const [stats, setStats] = useState({
    onlinePlayers: 0,
    maxPlayers: 0,
    online: false,
    latency: null,
    fetchedAt: null,
  });
  const [statusState, setStatusState] = useState({
    loading: true,
    error: null,
  });

  const loadStats = useCallback(async ({ showLoading = false } = {}) => {
    setStatusState((prev) => ({
      loading: showLoading ? true : prev.loading,
      error: null,
    }));

    try {
      const response = await fetch("/api/players", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Request failed with ${response.status}`);
      }

      const payload = await response.json();
      setStats({
        onlinePlayers: payload.onlinePlayers ?? 0,
        maxPlayers: payload.maxPlayers ?? 0,
        online: Boolean(payload.online),
        latency: payload.latency ?? null,
        fetchedAt: payload.fetchedAt ?? null,
      });
      setStatusState({ loading: false, error: null });
    } catch (err) {
      console.error("Failed to fetch player stats", err);
      setStatusState({
        loading: false,
        error: "Nem sikerült frissíteni az adatokat.",
      });
    }
  }, []);

  useEffect(() => {
    loadStats({ showLoading: true });
    const interval = setInterval(() => loadStats(), 60000);
    return () => clearInterval(interval);
  }, [loadStats]);

  const statusColor = statusState.loading
    ? "text-amber-400"
    : stats.online
    ? "text-green-400"
    : "text-red-400";
  const pulseColor = statusState.loading
    ? "bg-amber-400"
    : stats.online
    ? "bg-green-500"
    : "bg-red-500";
  const connectionText = statusState.loading
    ? "ELLENŐRZÉS..."
    : stats.online
    ? "ONLINE"
    : "OFFLINE";
  const playerLabel = statusState.loading
    ? "--"
    : stats.onlinePlayers.toLocaleString("hu-HU");
  const maxPlayersLabel =
    !statusState.loading && stats.maxPlayers
      ? stats.maxPlayers.toLocaleString("hu-HU")
      : null;
  const latencyLabel = statusState.loading
    ? "..."
    : stats.latency
    ? `${stats.latency} ms`
    : "n/a";
  const lastUpdateLabel = stats.fetchedAt
    ? new Intl.DateTimeFormat("hu-HU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(stats.fetchedAt))
    : statusState.loading
    ? "Folyamatban..."
    : "Ismeretlen";

  return (
    <div className="bg-neutral-950 border-y border-neutral-800 relative z-30 -mt-10 mx-4 md:mx-auto max-w-5xl rounded-xl shadow-2xl flex flex-wrap md:flex-nowrap justify-between items-center py-4 px-8 gap-4">
      <div className="flex items-center gap-4 text-white w-full md:w-auto justify-center md:justify-start">
        <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
          <Users size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-none">
            {playerLabel}
            {maxPlayersLabel && (
              <span className="ml-1 text-base text-gray-400 font-normal">
                /{maxPlayersLabel}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Játékos Online
          </p>
        </div>
      </div>

      <div className="w-px h-10 bg-gray-800 hidden md:block"></div>

      <div className="flex items-center gap-4 text-white w-full md:w-auto justify-center md:justify-start">
        <div className="p-3 bg-orange-500/10 rounded-full text-orange-500">
          <Server size={24} />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Szerver Státusz
          </p>
          <h3
            className={`text-base font-bold flex items-center gap-2 ${statusColor}`}
          >
            <span
              className={`w-2 h-2 ${pulseColor} rounded-full animate-pulse`}
            ></span>
            {connectionText}
          </h3>
        </div>
      </div>

      <div className="w-px h-10 bg-gray-800 hidden md:block"></div>

      <div className="flex items-center gap-4 text-white w-full md:w-auto justify-center md:justify-start">
        <a
          href="https://dc.legacymc.hu"
          className="text-gray-300 hover:text-white transition flex items-center gap-2 text-sm font-bold"
        >
          Csatlakozz Discord Szerverünkhöz <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
};

const Hero = () => {
  const SERVER_IP = "play.legacymc.hu";
  const { copied, copy } = useClipboard(SERVER_IP);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/back.png"
          alt="LegacyMC Background"
          layout="fill"
          objectFit="cover"
          className="scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/60 via-neutral-900/30 to-neutral-900 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/50 via-transparent to-neutral-900/50 z-10" />
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-neutral-900 to-transparent z-10" />
      </div>

      <div
        className={`relative z-20 text-center px-4 max-w-4xl mt-16 transition-all duration-1000 transform ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <div className="inline-flex items-center bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md animate-bounce-subtle">
          <span className="flex h-2 w-2 relative mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="text-amber-200 text-xs md:text-sm font-bold tracking-wide uppercase">
            Hamarosan elérhető!
          </span>
        </div>

        <h1 className="font-minecraft text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] tracking-tight">
          LÉPJ BE A <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">
            CSODÁK VILÁGÁBA
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed text-shadow">
          A LegacyMC elhozza a{" "}
          <span className="text-amber-400 font-bold">klasszikus</span> játék
          élményeket. Építs{" "}
          <span className="text-amber-400 font-bold">birodalmat</span>, harcolj
          egy <span className="text-amber-400 font-bold">arénában</span> vagy
          esetleg épitsd fel a{" "}
          <span className="text-amber-400 font-bold">bizniszed</span> egy
          blokkon!
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="relative group">
            <button
              onClick={copy}
              className="flex items-center justify-between w-full md:w-auto gap-4 bg-neutral-900/80 backdrop-blur-md text-white px-1 py-1 pr-6 rounded-xl border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            >
              <div className="bg-neutral-800 p-3 rounded-lg text-amber-500">
                {copied ? <Check size={20} /> : <Gamepad2 size={20} />}
              </div>
              <span className="font-mono text-lg font-bold tracking-widest text-gray-200 group-hover:text-amber-400 transition-colors">
                {SERVER_IP}
              </span>
              <div className="text-xs bg-amber-600 px-2 py-1 rounded uppercase font-bold text-white">
                {copied ? "MÁSOLVA" : "MÁSOLÁS"}
              </div>
            </button>
          </div>

          <a
            href="https://shop.legacymc.hu/register"
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] flex items-center"
          >
            <User size={20} className="mr-2" />
            REGISZTRÁCIÓ
          </a>
        </div>
      </div>
    </section>
  );
};

const GamemodeCard = ({ title, desc, icon, img, titleClass = "" }) => (
  <div className="group relative rounded-2xl overflow-hidden min-h-[400px] border border-white/5 bg-neutral-900">
    <Image
      src={img}
      alt={title}
      layout="fill"
      objectFit="cover"
      className="transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/50 to-transparent" />

    <div className="absolute bottom-0 p-8 z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
      <div className="mb-4 inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-white shadow-lg">
        {icon}
      </div>
      <h3 className={`text-3xl font-black text-white uppercase italic tracking-wider mb-2 ${titleClass}`}>
        {title}
      </h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-500 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto">
        {desc}
      </p>
      <span className="text-amber-400 text-sm font-bold uppercase tracking-widest group-hover:text-amber-300 transition-colors flex items-center gap-2">
        További infók <ArrowRight size={16} />
      </span>
    </div>
    <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-500/50 rounded-2xl transition-colors duration-300 pointer-events-none"></div>
  </div>
);

const About = () => {
  return (
    <section className="py-32 bg-neutral-900 relative">
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent"></div>

      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-minecraft text-4xl md:text-5xl font-black text-white mb-6 uppercase">
            A <span className="text-amber-500">Játékosok</span> a legfontosabbak
            a számunkra
          </h2>
          <p className="text-gray-400 text-lg">
            Célunk hogy eme közösség számára egy olyan stabil, lagmentes és
            szórakoztató környezetet biztosítsunk, ahová minden nap öröm
            visszajönni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GamemodeCard
            title="Lifesteal"
            desc="Hamarosan"
            icon={<Pickaxe size={24} />}
            img="/kit.png"
          />
          <GamemodeCard
            title="Hamarosan"
            desc="Hamarosan"
            icon={<Sparkles size={24} />}
            img="/logo.png"
          />
          <GamemodeCard
            title="Hamarosan"
            desc="Hamarosan"
            icon={<Sword size={24} />}
            img="/logo.png"
          />
          <GamemodeCard
            title="Hamarosan"
            desc="Hamarosan"
            icon={<Gamepad2 size={24} />}
            img="/logo.png"
            titleClass="font-minecraft"
          />
        </div>
      </div>
    </section>
  );
};

const TechnicalSection = () => {
  const [stats, setStats] = useState({
    loading: true,
    onlinePlayers: 0,
    maxPlayers: 0,
    totalRegistrations: 0,
    latency: null,
    online: false,
  });

  const loadTechnicalStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats", { cache: "no-store" });
      const payload = await response.json();

      setStats({
        loading: false,
        onlinePlayers: payload.onlinePlayers ?? 0,
        maxPlayers: payload.maxPlayers ?? 0,
        totalRegistrations: payload.totalRegistrations ?? 5000,
        latency: payload.latency ?? null,
        online: Boolean(payload.online),
      });
    } catch (error) {
      console.error("Failed to load technical stats", error);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadTechnicalStats();
    const interval = setInterval(loadTechnicalStats, 60000);
    return () => clearInterval(interval);
  }, [loadTechnicalStats]);

  const activePlayersLabel = stats.loading
    ? "--"
    : `${stats.onlinePlayers.toLocaleString("hu-HU")}${
        stats.maxPlayers ? `/${stats.maxPlayers.toLocaleString("hu-HU")}` : ""
      }`;

  const registrationsLabel = stats.loading
    ? "--"
    : `${stats.totalRegistrations.toLocaleString("hu-HU")}`;

  const usefulInfoLabel = stats.loading
    ? "--"
    : stats.online
    ? "ONLINE"
    : "OFFLINE";

  return (
    <section className="py-24 bg-neutral-950 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="font-minecraft text-3xl md:text-5xl font-black text-white tracking-wide">
            STATISZTIKA
          </h2>
          <p className="font-minecraft text-gray-400 mt-3 text-sm md:text-base tracking-wide">
            LegacyMC számok egy helyen
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <p className="font-minecraft text-3xl font-bold text-amber-400 leading-none">{activePlayersLabel}</p>
            <p className="font-minecraft text-sm text-gray-400 mt-2">Aktív Játékos</p>
          </div>
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <p className="font-minecraft text-3xl font-bold text-white leading-none">{registrationsLabel}</p>
            <p className="font-minecraft text-sm text-gray-400 mt-2">Regisztrációk</p>
          </div>
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-5">
            <p className={`font-minecraft text-3xl font-bold leading-none ${stats.online ? "text-green-400" : "text-red-400"}`}>
              {usefulInfoLabel}
            </p>
            <p className="font-minecraft text-sm text-gray-400 mt-2">Szerver állapot</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Step = ({ number, title, desc, delay }) => (
  <div
    className={`relative flex gap-6 z-10 transform hover:translate-x-2 transition-transform duration-300`}
  >
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-full border-2 border-amber-500 text-amber-500 font-bold text-xl shadow-lg shadow-amber-500/20 z-10">
        {number}
      </div>
      <div className="w-px flex-1 bg-gray-800 my-2 last:hidden"></div>
    </div>
    <div className="pb-12">
      <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        {title}
        {number === "4" && (
          <span className="text-green-500 text-sm bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
            START
          </span>
        )}
      </h4>
      <p className="text-gray-400 max-w-sm">{desc}</p>
    </div>
  </div>
);

const HowToJoin = () => {
  return (
    <section className="py-24 bg-neutral-900 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-minecraft text-5xl font-black text-white mb-8">
              ÚJ VAGY NÁLUNK???! <br />
              <span className="text-amber-500">KEZDD ITT!</span>
            </h2>
            <div className="space-y-2 mt-8">
              <Step
                number="1"
                title="Regisztrálj"
                desc="Kattints a 'Regisztráció' gombra, töltsd ki az adataidat. Ez ingyenes és kb. 1 perc."
              />
              <Step
                number="2"
                title="Lépj be a Játékba"
                desc="Indítsd el a Minecraftot (Eredeti vagy Tört). A támogatott verzió: 1.18.2 - 1.21.5."
              />
              <Step
                number="3"
                title="Add Hozzá a Szervert"
                desc="Többjátékos mód -> Szerver hozzáadása. IP: play.legacymc.hu"
              />
              <Step
                number="4"
                title="Játssz!"
                desc="Csatlakozz, jelentkezz be a jelszavaddal (/login jelszó) és kezdődjön a kaland!"
              />
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-tr from-amber-600 to-orange-500 rounded-3xl p-1 shadow-[0_0_50px_rgba(234,88,12,0.3)]">
              <div className="bg-neutral-900 rounded-[22px] overflow-hidden relative min-h-[500px]">
                <Image
                  src="/back.png"
                  alt="How to join tutorial"
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center p-8">
                  <div>
                    <AlertTriangle
                      size={64}
                      className="text-amber-500 mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Kell segítség?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Csatlakozz Discord szerverünkre és kérj segítséget a
                      #hibajegy csatornában!
                    </p>
                    <a
                      href="https://dc.legacymc.hu"
                      className="inline-flex items-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg font-bold transition-colors"
                    >
                      <FaDiscord size={20} className="mr-2" />
                      CSATLAKOZÁS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-neutral-950 border-t border-white/5 pt-20 pb-10">
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
              { Icon: FaYoutube, url: "https://youtube.com/@mrbarneyy" }, // Ide írd be a saját YT linked
              { Icon: FaFacebook, url: "https://facebook.com/legacymc.hu" }, // Ide írd be a saját FB linked
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
            href="https://discord.gg/vUrHehCVjr"
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

export default function Home() {
  return (
    <div className="bg-neutral-900 min-h-screen text-gray-200 selection:bg-amber-500/30 selection:text-amber-200">
      <Head>
        <title>LegacyMC</title>
        <meta
          name="description"
          content="A LegacyMC visszahozza a régi LegendaryMC hangulatot modern köntösben. Survival, Skyblock és PvP élmények."
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Navbar />

      <main className="font-[Inter,sans-serif]">
        <Hero />
        <StatsStrip />
        <About />
        <TechnicalSection />
        <HowToJoin />
      </main>

      <Footer />
    </div>
  );
}
