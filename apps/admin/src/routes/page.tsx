import { useEffect, useState } from "react";
import { Helmet } from "@modern-js/runtime/head";
import { trpcClient } from "@/api/trpc";
import "./index.css";
import { useI18n } from "@/locales";

const CreateUserForm = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await trpcClient.users.create.mutate({ email, name });
      setMessage(t("users.create.success"));
    } catch {
      setError(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card" style={{ marginTop: 16 }}>
      <h2>{t("users.create.title")}</h2>
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="email"
          placeholder={t("users.dto.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <input
          type="text"
          placeholder={t("users.dto.name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: 8 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          {loading ? t("common.loading") : t("common.ok")}
        </button>
      </div>
      {message && <p style={{ color: "green", marginTop: 8 }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </form>
  );
};

const HealthStatus = () => {
  const [status, setStatus] = useState<"unknown" | "ok" | "error">("unknown");
  const { t } = useI18n();
  useEffect(() => {
    (async () => {
      try {
        // const res = await trpcClient.health.query()
        const res = await trpcClient.users.list.query();
        console.log(res);
        setStatus(res ? "ok" : "error");
      } catch {
        setStatus("error");
      }
    })();
  }, []);

  return (
    <p className="description" style={{ marginTop: 12 }}>
      {t("health.title")}:{" "}
      {status === "unknown"
        ? t("common.loading")
        : status === "ok"
          ? t("health.ok")
          : t("common.error")}
    </p>
  );
};

const Index = () => (
  <div className="container-box">
    {/* @ts-ignore */}
    <Helmet>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>
    <main>
      <HealthStatus />
      <CreateUserForm />
    </main>
  </div>
);

export default Index;
