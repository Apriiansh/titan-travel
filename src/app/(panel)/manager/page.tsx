import { getSession } from "@/lib/auth";

export default async function ManagerDashboardPage() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-(family-name:--font-playfair)">
          Beranda Manager
        </h1>
        <p className="text-foreground-secondary">
          Halo, <strong>{session?.name as string}</strong>. Akses cepat kinerja dan laporan penjualan.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-xl border border-card-border bg-card-bg shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-sm font-medium text-foreground-secondary">Laporan Pending</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-yellow-500">5</span>
            <span className="text-sm text-foreground-secondary ml-2">Perlu ditinjau</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-xl border border-card-border bg-card-bg shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-sm font-medium text-foreground-secondary">Booking Selesai</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-green-500">42</span>
            <span className="text-sm text-foreground-secondary ml-2">Bulan Ini</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-xl border border-card-border bg-card-bg shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-sm font-medium text-foreground-secondary">Tingkat Kepuasan</h3>
          <div className="mt-4">
            <span className="text-3xl font-bold text-primary-500">4.8</span>
            <span className="text-sm text-foreground-secondary ml-2">/ 5.0</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-card-border bg-card-bg/50 border-dashed h-96 flex flex-col items-center justify-center text-foreground-secondary mt-4">
          <p className="text-sm">Ringkasan Grafik Booking Tahunan</p>
      </div>
    </div>
  );
}
