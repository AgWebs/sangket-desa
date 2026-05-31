"use client";

import React from "react";
import { useNavigation } from "@refinedev/core";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Pencil,
  MapPin,
  Building2,
  Tag,
  MapPinned,
  FileText,
  ImageIcon,
} from "lucide-react";

import { DUMMY_FASILITAS, KondisiBadge } from "../../page";

// ─── Dynamic import Leaflet (no SSR) ─────────────────────────────────────────
const MapView = dynamic(() => import("@/components/map-view"), { ssr: false });

export default function FasilitasPublikShowPage() {
  const params = useParams();
  const id = Number(params.id);
  const { list, edit } = useNavigation();

  // Ganti dengan useOne setelah backend siap
  const data = DUMMY_FASILITAS.find((f) => f.id === id);

  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Data fasilitas tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 md:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => list("fasilitas-publik")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{data.nama_fasilitas}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Detail Fasilitas Publik</p>
          </div>
        </div>
        <Button onClick={() => edit("fasilitas-publik", id)} className="gap-2">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Kolom Kiri: Info + Foto ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Info Utama */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Informasi Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                label="Nama Fasilitas"
                value={data.nama_fasilitas}
              />
              <Separator />
              <InfoRow
                icon={<Tag className="h-4 w-4 text-muted-foreground" />}
                label="Jenis / Kategori"
                value={<Badge variant="secondary">{data.jenis_kategori}</Badge>}
              />
              <Separator />
              <InfoRow
                icon={<MapPinned className="h-4 w-4 text-muted-foreground" />}
                label="Lokasi Dusun"
                value={data.lokasi_dusun}
              />
              <Separator />
              <InfoRow
                icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                label="Kondisi"
                value={<KondisiBadge kondisi={data.kondisi} />}
              />
              {data.keterangan && (
                <>
                  <Separator />
                  <InfoRow
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    label="Keterangan"
                    value={<span className="text-sm leading-relaxed">{data.keterangan}</span>}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Foto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> Foto Fasilitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.foto_url ? (
                <img
                  src={data.foto_url}
                  alt={data.nama_fasilitas}
                  className="rounded-lg w-full object-cover max-h-72 border"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-40 rounded-lg border-2 border-dashed text-muted-foreground gap-2">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm">Belum ada foto</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Kolom Kanan: Peta + Koordinat ─────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Lokasi pada Peta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg overflow-hidden border h-64">
                <MapView
                  latitude={data.latitude}
                  longitude={data.longitude}
                  label={data.nama_fasilitas}
                />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Latitude</span>
                  <span className="font-mono">{data.latitude.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Longitude</span>
                  <span className="font-mono">{data.longitude.toFixed(6)}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => window.open(`https://maps.google.com/?q=${data.latitude},${data.longitude}`, "_blank")}
              >
                <MapPin className="h-3.5 w-3.5" />
                Buka di Google Maps
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Helper Row ───────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}