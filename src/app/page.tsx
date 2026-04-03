import Link from "next/link";
import { DM_Sans, Montserrat } from "next/font/google";

const monntserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export default function LandingPage() {
  return (
    <div className={`${monntserrat.variable} ${dmSans.variable}`}>
      <style>{`
        :root {
          --ink: #FCFCFC; --ink-soft: #3d3a35; --ink-muted: #6b6760;
          --paper: #1a1714; --paper-dark: #ede9e2;
          --accent: #0070F3; --accent-light: #d9eaff; --white: #faf8f5;
        }
        .font-display { font-family: var(--font-display), Georgia, serif; }
        .font-sans { font-family: var(--font-sans), system-ui, sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }
        .delay-5 { animation-delay: 0.7s; opacity: 0; }
        .feature-card:hover { background: #2a2621; }
        .feature-card { transition: background 0.2s ease; }
      `}</style>

      <div
        style={{
          background: "var(--ink)",
          minHeight: "100vh",
          fontFamily: "var(--font-sans)",
        }}
      >
        {/* Nav */}
        <nav style={{ borderBottom: "1px solid #2d2a25", padding: "0 48px" }}>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 22,
                color: "var(--paper)",
                letterSpacing: "-0.02em",
              }}
            >
              ClientFlow
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <Link
                href="/login"
                style={{
                  fontSize: 14,
                  color: "var(--ink-muted)",
                  textDecoration: "none",
                }}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                style={{
                  fontSize: 14,
                  background: "var(--accent)",
                  color: "var(--ink)",
                  padding: "8px 20px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Get started free
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section
          style={{
            padding: "100px 48px 80px",
            borderBottom: "1px solid #2d2a25",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div
              className="animate-fade-up delay-1"
              style={{
                display: "inline-block",
                border: "1px solid var(--paper)",
                borderRadius: 20,
                padding: "4px 14px",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--paper)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                For freelancers & agencies
              </span>
            </div>
            <h1
              className="animate-fade-up delay-2 font-display"
              style={{
                fontSize: "clamp(48px, 7vw, 88px)",
                fontWeight: 800,
                lineHeight: 1.05,
                color: "var(--paper)",
                letterSpacing: "-0.03em",
                marginBottom: 28,
                maxWidth: 820,
              }}
            >
              Design your
              <br />
              <span style={{ color: "var(--accent)" }}>workflow</span>
              <br />
              with intention.
            </h1>
            <p
              className="animate-fade-up delay-3"
              style={{
                fontSize: 18,
                color: "var(--ink-muted)",
                maxWidth: 520,
                lineHeight: 1.7,
                marginBottom: 48,
              }}
            >
              ClientFlow gives you a private workspace for every client —
              projects, deliverables, feedback, and invoices all in one place.
              No more chasing approvals over email.
            </p>
            <div
              className="animate-fade-up delay-4"
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Link
                href="/signup"
                style={{
                  display: "inline-block",
                  background: "var(--accent)",
                  color: "var(--ink)",
                  padding: "14px 32px",
                  borderRadius: 8,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Start for free →
              </Link>
              <Link
                href="/login"
                style={{
                  display: "inline-block",
                  color: "var(--ink-muted)",
                  textDecoration: "none",
                  fontSize: 14,
                  padding: "14px 8px",
                }}
              >
                Already have an account?
              </Link>
            </div>
            <div
              className="animate-fade-up delay-5"
              style={{
                marginTop: 64,
                display: "flex",
                gap: 48,
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "100%", label: "Free to start" },
                { value: "Multi-tenant", label: "Every client isolated" },
                { value: "RLS", label: "Row-level security" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p
                    className="font-display"
                    style={{
                      fontSize: 28,
                      color: "var(--paper)",
                      letterSpacing: "-0.02em",
                      marginBottom: 2,
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          style={{ padding: "80px 48px", borderBottom: "1px solid #2d2a25" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 12,
                color: "var(--accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              Everything you need
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--paper)",
                letterSpacing: "-0.02em",
                marginBottom: 56,
                maxWidth: 580,
              }}
            >
              Built for the way freelancers actually work
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 8,
              }}
            >
              {[
                {
                  icon: "⬡",
                  title: "Client workspaces",
                  body: "Each client gets their own isolated space. They see only their projects, their files, their invoices. Nothing bleeds between clients.",
                },
                {
                  icon: "◈",
                  title: "Deliverable approvals",
                  body: "Upload files and get structured feedback. Clients approve, request revisions, or leave comments — all tracked in one place.",
                },
                {
                  icon: "◎",
                  title: "Professional invoicing",
                  body: "Create invoices with line items, track payment status from draft to paid, and export clean PDFs in one click.",
                },
                {
                  icon: "◫",
                  title: "Team management",
                  body: "Invite teammates and clients with role-based access. Owners, members, and clients each see exactly what they should.",
                },
                {
                  icon: "◐",
                  title: "Project tracking",
                  body: "Organise work into projects with due dates, status tracking, and a team view. Know what's active and what's done.",
                },
                {
                  icon: "◑",
                  title: "Secure by design",
                  body: "Built on Supabase with Row Level Security. Your data and your clients' data are isolated at the database level — not just in the UI.",
                },
              ].map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="feature-card"
                  style={{
                    background: "var(--accent-light)",
                    borderRadius: 12,
                    padding: "32px 28px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 24,
                      marginBottom: 16,
                      color: "var(--accent)",
                    }}
                  >
                    {icon}
                  </p>
                  <p
                    className="font-display"
                    style={{
                      fontSize: 18,
                      color: "var(--paper)",
                      marginBottom: 10,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--ink-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          style={{ padding: "80px 48px", borderBottom: "1px solid #2d2a25" }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <p
              style={{
                fontSize: 12,
                color: "var(--accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              How it works
            </p>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                color: "var(--paper)",
                letterSpacing: "-0.02em",
                marginBottom: 56,
              }}
            >
              Up and running in minutes
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 48,
              }}
            >
              {[
                {
                  step: "01",
                  title: "Create your workspace",
                  body: "Sign up and name your organization. Takes 30 seconds.",
                },
                {
                  step: "02",
                  title: "Invite your client",
                  body: "Send an email invite. They set a password and land straight in their project.",
                },
                {
                  step: "03",
                  title: "Upload deliverables",
                  body: "Share files, collect feedback, and track approvals — all in one thread.",
                },
                {
                  step: "04",
                  title: "Send an invoice",
                  body: "Create an invoice from your project, mark it paid, and download the PDF.",
                },
              ].map(({ step, title, body }) => (
                <div key={step}>
                  <p
                    className="font-display"
                    style={{
                      fontSize: 48,
                      color: "#2d2a25",
                      letterSpacing: "-0.04em",
                      marginBottom: 16,
                      lineHeight: 1,
                    }}
                  >
                    {step}
                  </p>
                  <p
                    style={{
                      fontSize: 16,
                      color: "var(--paper)",
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    {title}
                  </p>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--ink-muted)",
                      lineHeight: 1.7,
                    }}
                  >
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section
          style={{ padding: "80px 48px", borderBottom: "1px solid #2d2a25" }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div>
              <p
                className="font-display"
                style={{
                  fontSize: "clamp(24px, 3vw, 36px)",
                  color: "var(--paper)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.02em",
                  marginBottom: 32,
                }}
              >
                &quot;My clients used to email me asking where the latest
                version was. Now they just log in.&quot;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  S
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--paper)",
                      fontWeight: 500,
                    }}
                  >
                    Sara Kovač
                  </p>
                  <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                    Brand designer, freelance
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {[
                { label: "Projects managed", value: "12" },
                { label: "Invoices sent", value: "48" },
                { label: "Clients onboarded", value: "9" },
                { label: "Hours saved / week", value: "~4" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "var(--accent-light)",
                    borderRadius: 8,
                    padding: "20px 24px",
                  }}
                >
                  <p
                    className="font-display"
                    style={{
                      fontSize: 32,
                      color: "var(--accent)",
                      letterSpacing: "-0.03em",
                      marginBottom: 4,
                    }}
                  >
                    {value}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--ink-muted)" }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "100px 48px" }}>
          <div
            style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}
          >
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                color: "var(--paper)",
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}
            >
              Ready to look more professional?
            </h2>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-muted)",
                marginBottom: 40,
                maxWidth: 440,
                margin: "0 auto 40px",
              }}
            >
              Free to start. No credit card required. Your first workspace is
              ready in 60 seconds.
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "var(--ink)",
                padding: "16px 40px",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              Create your workspace →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{ borderTop: "1px solid #2d2a25", padding: "32px 48px" }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: 18,
                color: "var(--ink-soft)",
                letterSpacing: "-0.02em",
              }}
            >
              ClientFlow
            </span>
            <p style={{ fontSize: 13, color: "var(--ink-muted)" }}>
              Built with Next.js, Supabase & Vercel
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
