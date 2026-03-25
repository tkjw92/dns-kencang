import { Activity, Clock, Database, Globe, Layers, Moon, RefreshCw, Server, Shield, ShieldAlert, Sun, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "./components/theme-provider";
import { useState, useEffect } from "react";
import type StatsType from "./types"

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

function numberFormat(value: number) {
  const formattedValue = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0
  }).format(value)

  return formattedValue
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  colorClass: string;
}) {
  return (
    <Card className="relative overflow-hidden border-border/50 group">
      <CardContent className="relative p-5">

        {/* Animated Overlay */}
        <div
          className={`
            absolute inset-0
            opacity-70 md:opacity-0 md:group-hover:opacity-100
            transition-opacity duration-500
          `}
        >
          {/* Glow 1 */}
          <div
            className={`
              absolute -top-10 -right-10 w-40 h-40
              rounded-full blur-3xl
              ${colorClass} bg-current/20
              animate-float
            `}
          />

          {/* Glow 2 */}
          <div
            className={`
              absolute -bottom-10 -left-10 w-32 h-32
              rounded-full blur-2xl
              ${colorClass} bg-current/10
              animate-float-delayed
            `}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground text-start">{title}</p>
            <p className={`text-3xl font-bold tracking-tight ${colorClass}`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Icon */}
          <div
            className={`
              relative z-10
              rounded-lg p-2.5
              ${colorClass}
              bg-current/10
              transition-all duration-300
              group-hover:scale-110 group-hover:-translate-y-1
            `}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="
        relative group
        flex items-center justify-between
        py-2.5 px-2
        rounded-md
        transition-all duration-200
        hover:bg-muted/40
      "
    >
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span
        className="
          text-sm font-mono font-medium text-foreground
          max-w-[60%]
          truncate
          transition-colors duration-200
          group-hover:text-primary
        "
        title={String(value)}
      >
        {value}
      </span>

      <div className="absolute inset-x-0 bottom-0 h-px bg-border/20 last:hidden" />
    </div>
  );
}

const Index = () => {
  const [unboundStats, setUnboundStats] = useState<StatsType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // The path is relative to the 'public' folder (e.g., /data/items.json)
    fetch('/stats.json', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<StatsType>;
      })
      .then(jsonData => {
        setUnboundStats(jsonData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // The empty array ensures this runs once after the initial render

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (unboundStats === undefined) {
    return
  }

  const cacheHitRate = ((unboundStats.total.num.cachehits / unboundStats.total.num.queries) * 100).toFixed(1);
  const serverTime = new Date(unboundStats.time.now * 1000).toLocaleString();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-2.5">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Unbound Statistics
              </h1>
              <p className="text-sm text-muted-foreground text-start">
                DNS Resolver Monitoring
              </p>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={() => location.reload()}
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5 text-sm hover:bg-muted transition"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => theme.theme === "dark" ? theme.setTheme("light") : theme.setTheme("dark")}
              className="inline-flex items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5 text-sm hover:bg-muted transition"
            >
              {theme.theme === "dark" ? (
                <>
                  <Sun className="h-4 w-4" />
                  Light
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4" />
                  Dark
                </>
              )}
            </button>

            {/* Status */}
            <div className="flex items-center gap-2 rounded-lg bg-success/15 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">
                Uptime: {formatUptime(unboundStats.time.up)}
              </span>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Queries"
            value={numberFormat(unboundStats.total.num.queries)}
            icon={Globe}
            colorClass="text-primary"
          />
          <StatCard
            title="Cache Hits"
            value={numberFormat(unboundStats.total.num.cachehits)}
            subtitle={`${cacheHitRate}% hit rate`}
            icon={Zap}
            colorClass="text-success"
          />
          <StatCard
            title="Cache Misses"
            value={numberFormat(unboundStats.total.num.cachemiss)}
            icon={Database}
            colorClass="text-warning"
          />
          <StatCard
            title="Recursive Replies"
            value={numberFormat(unboundStats.total.num.recursivereplies)}
            icon={Activity}
            colorClass="text-primary"
          />
          <StatCard
            title="RPZ Hits"
            value={numberFormat(unboundStats.num.rpz.action["rpz-cname-override"])}
            icon={ShieldAlert}
            colorClass="text-destructive"
          />
        </div>

        {/* Request List & Performance */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-primary" />
                Request List
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <InfoRow label="Average" value={unboundStats.total.requestlist.avg} />
              <InfoRow label="Max" value={unboundStats.total.requestlist.max} />
              <InfoRow label="Current (all)" value={unboundStats.total.requestlist.current.all} />
              <InfoRow label="Current (user)" value={unboundStats.total.requestlist.current.user} />
              <InfoRow label="Overwritten" value={unboundStats.total.requestlist.overwritten} />
              <InfoRow label="Exceeded" value={unboundStats.total.requestlist.exceeded} />
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Recursion Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <InfoRow label="Avg Time" value={`${(unboundStats.total.recursion.time.avg * 1000).toFixed(2)} ms`} />
              <InfoRow label="Median Time" value={`${(unboundStats.total.recursion.time.median * 1000).toFixed(2)} ms`} />
            </CardContent>
          </Card>
        </div>

        {/* Server Info */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4 text-primary" />
              Server Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              <div>
                <InfoRow label="TCP Usage" value={unboundStats.total.tcpusage} />
                <InfoRow label="IP Rate Limited" value={unboundStats.total.num.queries_ip_ratelimited} />
                <InfoRow label="Prefetches" value={unboundStats.total.num.prefetch} />
                <InfoRow label="Expired" value={unboundStats.total.num.expired} />
              </div>
              <div>
                <InfoRow label="Server Uptime" value={formatUptime(unboundStats.time.up)} />
                <InfoRow label="Server Time" value={serverTime} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
