import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Waves,
  Target,
  Eye,
  Compass,
  Flag,
  Award,
  Globe,
  Users,
  TrendingUp,
  Anchor,
  Ship,
  Fish,
  ShieldCheck,
  Heart,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const heroImg =
  "https://images.unsplash.com/photo-1610690699784-f037ec27a65f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHN1bnNldCUyMHdhdmVzJTIwdHJvcGljYWx8ZW58MXx8fHwxNzcyNjQyOTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const fishingImg =
  "https://images.unsplash.com/photo-1770892288370-9a08afc4b662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwZmlzaGluZyUyMGluZHVzdHJ5JTIwYm9hdCUyMG9jZWFufGVufDF8fHx8MTc3MjY0Mjk1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const marketImg =
  "https://images.unsplash.com/photo-1761634731495-f8ff62712b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwbWFya2V0JTIwZnJlc2glMjBzZWFmb29kJTIwZGlzcGxheXxlbnwxfHx8fDE3NzI2NDI5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const processingImg =
  "https://images.unsplash.com/photo-1617448570646-652843c87581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwcHJvY2Vzc2luZyUyMGZhY3RvcnklMjB3b3JrZXJzfGVufDF8fHx8MTc3MjY0Mjk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const harborImg =
  "https://images.unsplash.com/photo-1772208089946-4b868ed3dec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwZmlzaGluZyUyMHZlc3NlbCUyMGRvY2slMjBoYXJib3J8ZW58MXx8fHwxNzcyNjQyOTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const warehouseImg =
  "https://images.unsplash.com/photo-1729301185353-da26019b1614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFmb29kJTIwd2FyZWhvdXNlJTIwY29sZCUyMHN0b3JhZ2V8ZW58MXx8fHwxNzcyNjQyOTUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const teamImg =
  "https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwYnVzaW5lc3MlMjBtZWV0aW5nJTIwb2ZmaWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MjY0Mjk1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const MILESTONES = [
  {
    year: "2010",
    title: "The Beginning",
    description:
      "Glory One was founded in Yangon, Myanmar with a small team of 5, driven by a passion for bringing the freshest ocean harvest directly to families.",
    icon: <Anchor size={20} />,
    image: fishingImg,
  },
  {
    year: "2013",
    title: "First Processing Facility",
    description:
      "Opened our first state-of-the-art seafood processing and cold storage facility, enabling us to guarantee freshness from ocean to table.",
    icon: <Ship size={20} />,
    image: processingImg,
  },
  {
    year: "2016",
    title: "Nationwide Expansion",
    description:
      "Expanded delivery operations to cover all major cities across Myanmar, reaching over 50,000 households with premium seafood.",
    icon: <Globe size={20} />,
    image: harborImg,
  },
  {
    year: "2019",
    title: "Quality Certification",
    description:
      "Achieved ISO 22000 food safety certification and HACCP compliance, solidifying our commitment to the highest quality standards.",
    icon: <Award size={20} />,
    image: warehouseImg,
  },
  {
    year: "2022",
    title: "E-Commerce Launch",
    description:
      "Launched our online platform, making it easier than ever for customers to order fresh seafood from the comfort of their homes.",
    icon: <TrendingUp size={20} />,
    image: marketImg,
  },
  {
    year: "2025",
    title: "Regional Growth",
    description:
      "Expanded operations to serve customers across Southeast Asia, partnering with sustainable fishing communities in 5 countries.",
    icon: <Sparkles size={20} />,
    image: teamImg,
  },
];

const STATS = [
  { value: "15+", label: "Years of Experience", icon: <Award size={22} /> },
  { value: "200+", label: "Seafood Products", icon: <Fish size={22} /> },
  { value: "50K+", label: "Happy Customers", icon: <Heart size={22} /> },
  { value: "5", label: "Countries Served", icon: <Globe size={22} /> },
];

const GOALS = [
  {
    icon: <ShieldCheck size={24} />,
    title: "Premium Quality Assurance",
    description:
      "Maintain the highest food safety standards with rigorous quality checks at every stage, from sourcing to delivery.",
  },
  {
    icon: <Globe size={24} />,
    title: "Sustainable Sourcing",
    description:
      "Partner exclusively with sustainable fishing communities and eco-certified suppliers to protect our oceans for future generations.",
  },
  {
    icon: <Users size={24} />,
    title: "Community Empowerment",
    description:
      "Support local fishing communities by providing fair trade partnerships and investing in education and infrastructure.",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Innovation & Growth",
    description:
      "Continuously innovate our supply chain and technology to deliver fresher products faster, while expanding to new markets.",
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative text-white overflow-hidden" style={{ minHeight: "420px" }}>
        <div className="absolute inset-0">
          <ImageWithFallback
            src={heroImg}
            alt="Ocean waves"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/90 via-[#0369a1]/80 to-[#0284c7]/70" />
        </div>

        {/* Ocean decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-[8%] opacity-10">
            <Waves size={140} />
          </div>
          <div className="absolute bottom-12 right-[10%] opacity-10 rotate-12">
            <Waves size={100} />
          </div>
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8" style={{ fontSize: "0.85rem" }}>
            <Link
              to="/"
              className="text-white/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={14} /> Home
            </Link>
            <span className="text-white/40">/</span>
            <span className="text-white">About Us</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Anchor size={24} />
              </div>
              <div
                className="text-white/60 uppercase tracking-widest"
                style={{ fontSize: "0.75rem" }}
              >
                Our Story
              </div>
            </div>
            <h1 className="text-white mb-4" style={{ fontSize: "2.8rem", lineHeight: 1.15 }}>
              About <span className="text-sky-300">Glory One</span>
            </h1>
            <p className="text-white/75 leading-relaxed" style={{ fontSize: "1.05rem" }}>
              From the pristine waters of Myanmar to your table, Glory One has been delivering the
              finest seafood for over 15 years. We believe that everyone deserves access to fresh,
              sustainably sourced ocean treasures.
            </p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-[#0369a1] mb-3">
                  {stat.icon}
                </div>
                <div
                  className="text-[#0c4a6e] font-bold"
                  style={{ fontSize: "1.8rem" }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Company History */}
      <section className="bg-gradient-to-b from-white to-blue-50/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 bg-blue-50 text-[#0369a1] px-4 py-1.5 rounded-full mb-4"
              style={{ fontSize: "0.78rem" }}
            >
              <Ship size={14} />
              Our Journey
            </div>
            <h2 className="text-[#0c4a6e] mb-3" style={{ fontSize: "2rem" }}>
              Company History
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{ fontSize: "0.95rem" }}
            >
              What started as a small family operation has grown into one of Myanmar's most trusted
              seafood providers. Here's a glimpse into our journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.95rem" }}>
                Founded in <strong className="text-[#0c4a6e]">2010</strong>, Glory One began with a
                simple mission: to bridge the gap between Myanmar's rich marine resources and
                quality-conscious consumers. Our founder, inspired by generations of fishing
                traditions along the Andaman Sea, envisioned a company that would honor those
                traditions while embracing modern standards of quality and sustainability.
              </p>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.95rem" }}>
                Over the years, we've built lasting partnerships with local fishing communities,
                invested heavily in cold-chain infrastructure, and developed a reputation for
                uncompromising freshness. Our vertically integrated supply chain — from ocean to
                processing to doorstep delivery — ensures that every product meets the Glory One
                standard.
              </p>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.95rem" }}>
                Today, we proudly serve over <strong className="text-[#0c4a6e]">50,000 customers</strong>{" "}
                across <strong className="text-[#0c4a6e]">5 countries</strong> in Southeast Asia,
                offering more than 200 premium seafood products — all backed by our freshness
                guarantee.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={fishingImg}
                    alt="Fishing industry"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={warehouseImg}
                    alt="Cold storage warehouse"
                    className="w-full h-36 object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={marketImg}
                    alt="Fresh seafood market"
                    className="w-full h-36 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={processingImg}
                    alt="Seafood processing"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Goals */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div
              className="inline-flex items-center gap-2 bg-blue-50 text-[#0369a1] px-4 py-1.5 rounded-full mb-4"
              style={{ fontSize: "0.78rem" }}
            >
              <Compass size={14} />
              What Drives Us
            </div>
            <h2 className="text-[#0c4a6e] mb-3" style={{ fontSize: "2rem" }}>
              Mission, Vision & Goals
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-7 shadow-sm group hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0369a1]/5 rounded-bl-full" />
              <div className="w-14 h-14 rounded-2xl bg-[#0369a1] flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <Target size={26} />
              </div>
              <h3 className="text-[#0c4a6e] mb-3" style={{ fontSize: "1.2rem" }}>
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.9rem" }}>
                To deliver the freshest, highest-quality seafood to every household, while
                supporting sustainable fishing practices and empowering local coastal communities
                across Southeast Asia.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-2xl p-7 shadow-sm group hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/5 rounded-bl-full" />
              <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <Eye size={26} />
              </div>
              <h3 className="text-[#0c4a6e] mb-3" style={{ fontSize: "1.2rem" }}>
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: "0.9rem" }}>
                To become Southeast Asia's most trusted and beloved seafood brand — recognized for
                our unwavering commitment to quality, sustainability, and customer delight in every
                bite.
              </p>
            </motion.div>

            {/* Core Values */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative bg-gradient-to-br from-teal-50 to-white border border-teal-100 rounded-2xl p-7 shadow-sm group hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-400/5 rounded-bl-full" />
              <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform">
                <Flag size={26} />
              </div>
              <h3 className="text-[#0c4a6e] mb-3" style={{ fontSize: "1.2rem" }}>
                Core Values
              </h3>
              <ul className="text-gray-600 space-y-2" style={{ fontSize: "0.9rem" }}>
                <li className="flex items-start gap-2">
                  <Fish size={16} className="text-teal-500 mt-0.5 shrink-0" />
                  <span>Ocean-to-table freshness guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={16} className="text-teal-500 mt-0.5 shrink-0" />
                  <span>Transparency & food safety first</span>
                </li>
                <li className="flex items-start gap-2">
                  <Heart size={16} className="text-teal-500 mt-0.5 shrink-0" />
                  <span>Community-driven growth</span>
                </li>
                <li className="flex items-start gap-2">
                  <Anchor size={16} className="text-teal-500 mt-0.5 shrink-0" />
                  <span>Sustainable & responsible sourcing</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Strategic Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-[#0c4a6e] text-center mb-8"
              style={{ fontSize: "1.4rem" }}
            >
              Our Strategic Goals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {GOALS.map((goal, i) => (
                <motion.div
                  key={goal.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-blue-50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 flex items-center justify-center text-[#0369a1] mb-4">
                    {goal.icon}
                  </div>
                  <h4 className="text-[#0c4a6e] mb-2" style={{ fontSize: "0.95rem" }}>
                    {goal.title}
                  </h4>
                  <p className="text-gray-500" style={{ fontSize: "0.82rem" }}>
                    {goal.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Milestones Timeline */}
      <section className="bg-gradient-to-b from-blue-50/50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div
              className="inline-flex items-center gap-2 bg-blue-50 text-[#0369a1] px-4 py-1.5 rounded-full mb-4"
              style={{ fontSize: "0.78rem" }}
            >
              <Award size={14} />
              Key Milestones
            </div>
            <h2 className="text-[#0c4a6e] mb-3" style={{ fontSize: "2rem" }}>
              Our Journey Through the Years
            </h2>
            <p
              className="text-gray-500 max-w-xl mx-auto"
              style={{ fontSize: "0.95rem" }}
            >
              From humble beginnings to regional growth, every milestone marks a step toward our
              vision.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Center line — desktop only */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0369a1]/30 via-[#0369a1]/20 to-transparent -translate-x-1/2" />

            <div className="space-y-10 lg:space-y-16">
              {MILESTONES.map((ms, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={ms.year}
                    initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`relative lg:flex lg:items-center lg:gap-8 ${
                      isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    {/* Content Card */}
                    <div className="lg:w-[calc(50%-2rem)] w-full">
                      <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <ImageWithFallback
                            src={ms.image}
                            alt={ms.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0c4a6e]/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <span
                              className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full"
                              style={{ fontSize: "0.75rem" }}
                            >
                              {ms.year}
                            </span>
                          </div>
                        </div>
                        {/* Text */}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#0369a1]">
                              {ms.icon}
                            </div>
                            <h3
                              className="text-[#0c4a6e]"
                              style={{ fontSize: "1.05rem" }}
                            >
                              {ms.title}
                            </h3>
                          </div>
                          <p
                            className="text-gray-500 leading-relaxed"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {ms.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Center dot — desktop only */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0369a1] text-white items-center justify-center shadow-lg shadow-[#0369a1]/20 z-10">
                      <span style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                        {ms.year.slice(-2)}
                      </span>
                    </div>

                    {/* Empty spacer for the other side */}
                    <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team / Industry Photo Banner */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={harborImg}
            alt="Harbor operations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c4a6e]/90 to-[#0369a1]/80" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <Waves size={40} className="mx-auto mb-4 opacity-40" />
            <h2 className="text-white mb-4" style={{ fontSize: "2rem" }}>
              From Our Waters to Your Table
            </h2>
            <p
              className="text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
              style={{ fontSize: "1rem" }}
            >
              Every day, our dedicated team works tirelessly to source, process, and deliver the
              freshest seafood. We're proud of the relationships we've built with local fishing
              communities and the trust our customers place in us.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/all-seafood"
                className="bg-white text-[#0369a1] px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2"
                style={{ fontSize: "0.95rem" }}
              >
                <Fish size={18} />
                Browse Our Products
              </Link>
              <Link
                to="/contact"
                className="border border-white/40 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2"
                style={{ fontSize: "0.95rem" }}
              >
                <Users size={18} />
                Get In Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
