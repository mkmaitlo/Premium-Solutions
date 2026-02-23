"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  Pencil, Trash2, X, Loader2, AlertTriangle,
  CheckCircle2, Plus, GripVertical
} from "lucide-react";
import {
  createDeal,
  updateDeal,
  deleteDeal,
  reorderDeals
} from "@/lib/actions/deal.actions";
import { IDeal } from "@/lib/database/models/deal.model";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const COLOR_OPTIONS = [
  { label: "Blue", value: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { label: "Purple", value: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { label: "Emerald", value: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { label: "Red", value: "bg-red-500/10 text-red-600 dark:text-red-400" },
  { label: "Teal", value: "bg-teal-500/10 text-teal-600 dark:text-teal-400" },
  { label: "Yellow", value: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500" },
];

function DealModal({
  deal,
  onClose,
  onSaved,
}: {
  deal?: IDeal;
  onClose: () => void;
  onSaved: (d: IDeal, isNew: boolean) => void;
}) {
  const isEditing = !!deal;
  const [emoji, setEmoji] = useState(deal?.emoji || "💼");
  const [name, setName] = useState(deal?.name || "");
  const [original, setOriginal] = useState(deal?.original || "");
  const [price, setPrice] = useState(deal?.price || "");
  const [color, setColor] = useState(deal?.color || COLOR_OPTIONS[0].value);

  // Auto-calculate % off — strip non-numeric chars (PKR, commas, spaces) first
  const parseNum = (val: string) => parseFloat(val.replace(/[^0-9.]/g, ""));
  const calcOff = (): string => {
    const orig = parseNum(original);
    const sale = parseNum(price);
    if (!orig || !sale || sale >= orig) return "";
    return Math.round(((orig - sale) / orig) * 100) + "%";
  };
  const off = calcOff();

  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim() || !original.trim() || !price.trim() || !off || !emoji.trim()) {
      setError("Please fill in all fields. Discount % requires valid prices.");
      return;
    }
    setError("");

    startTransition(async () => {
      const payload = { emoji, name, original, price, off, color };
      if (isEditing) {
        const res = await updateDeal({ dealId: deal._id, deal: payload });
        if (res) onSaved(res, false);
      } else {
        const res = await createDeal(payload);
        if (res) onSaved(res, true);
      }
    });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-card border border-border/60 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <div
          className="relative p-6 pb-5 border-b border-border/40"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.08), hsl(var(--secondary)/0.05))" }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
              >
                {isEditing ? <Pencil className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h2 className="text-base font-black text-foreground">{isEditing ? "Edit Deal" : "New Deal"}</h2>
                <p className="text-xs text-muted-foreground">{isEditing ? "Update existing featured deal" : "Add a new deal to the hero carousel"}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-16">
              <label className="text-xs font-bold text-muted-foreground uppercase">Emoji</label>
              <input
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full h-11 rounded-xl border border-border/60 bg-background/60 text-center text-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Canva Pro"
                className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Original Price</label>
              <input
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder="e.g. PKR 12,000"
                className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Offered Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. PKR 1,200"
                className="w-full h-11 px-4 rounded-xl border border-border/60 bg-background/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-2 w-24">
              <label className="text-xs font-bold text-muted-foreground uppercase">% Off</label>
              <div className="relative">
                <input
                  value={off || "—"}
                  disabled
                  readOnly
                  className="w-full h-11 px-3 rounded-xl border border-border/40 bg-muted/40 text-sm font-bold text-center text-primary cursor-not-allowed select-none"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" title="Auto-calculated" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">Auto-calculated</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">Accent Color Theme</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                    color === c.value ? "border-primary ring-2 ring-primary/20 " + c.value : "border-border/60 bg-transparent text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview panel */}
          <div className={`mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-background/40 border-border/30`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${color.split(" ")[0]}`}>
               <span>{emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-xs font-semibold text-foreground truncate leading-none">{name || "Name"}</p>
               <p className="text-[10px] text-muted-foreground mt-0.5 line-through">{original || "Original"}/mo</p>
            </div>
            <div className="text-right flex-shrink-0">
               <p className="text-sm font-extrabold text-foreground leading-none">
                 {price || "Price"}<span className="text-[10px] font-normal text-muted-foreground">/mo</span>
               </p>
            </div>
            <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 ${color}`}>
               -{off || "0%"}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20 mt-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-2xl border border-border/60 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 h-11 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> {isEditing ? "Save Changes" : "Create Deal"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  deal,
  onClose,
  onDeleted,
}: {
  deal: IDeal;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDeal(deal._id);
      onDeleted(deal._id);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl bg-card border border-border/60 shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold">Delete Deal?</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
          Are you sure you want to delete <strong className="text-foreground">{deal.name}</strong>? This will remove it from the hero carousel.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleDelete} disabled={isPending} className="flex-1 py-2.5 bg-destructive text-white rounded-xl font-semibold hover:bg-destructive/90 transition-colors flex items-center justify-center">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SortableDealCard({
  deal,
  onEdit,
  onDelete
}: {
  deal: IDeal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: deal._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col p-5 rounded-2xl border border-border/40 bg-card/60 hover:border-primary/40 hover:shadow-lg transition-colors ${
        isDragging ? "opacity-50 border-primary" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            {...attributes}
            {...listeners}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted cursor-grab active:cursor-grabbing hover:text-foreground transition-all"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm ${deal.color.split(" ")[0]}`}>
             {deal.emoji}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <h3 className="font-bold text-lg text-foreground mb-1">{deal.name}</h3>
      
      <div className="flex gap-4 mt-auto">
         <div>
            <p className="text-[10px] uppercase text-muted-foreground font-semibold">Original</p>
            <p className="font-mono text-sm line-through text-muted-foreground">{deal.original}</p>
         </div>
         <div>
            <p className="text-[10px] uppercase text-primary font-semibold">Price</p>
            <p className="font-mono text-sm font-bold text-foreground">{deal.price}</p>
         </div>
         <div className="ml-auto text-right">
            <div className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${deal.color}`}>
              -{deal.off}
            </div>
         </div>
      </div>
    </div>
  );
}

export default function AdminDealsClient({
  initialDeals,
}: {
  initialDeals: IDeal[];
}) {
  const [deals, setDeals] = useState(initialDeals);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IDeal | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<IDeal | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = deals.findIndex((d) => d._id === active.id);
      const newIndex = deals.findIndex((d) => d._id === over?.id);

      const reorderedDeals = arrayMove(deals, oldIndex, newIndex);
      setDeals(reorderedDeals);

      await reorderDeals(reorderedDeals.map((d) => d._id));
    }
  };

  const handleSaved = (deal: IDeal, isNew: boolean) => {
    if (isNew) {
      setDeals([deal, ...deals]);
    } else {
      setDeals(deals.map((d) => (d._id === deal._id ? deal : d)));
    }
    setModalOpen(false);
    setEditTarget(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      {modalOpen && (
        <DealModal
          deal={editTarget}
          onClose={() => { setModalOpen(false); setEditTarget(undefined); }}
          onSaved={handleSaved}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          deal={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={(id) => setDeals(deals.filter((d) => d._id !== id))}
        />
      )}

      <div className="flex items-center justify-between">
         <p className="text-sm text-muted-foreground">Manage the deals shown on the featured hero section.</p>
         <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))" }}
         >
            <Plus className="w-4 h-4" /> Add Deal
         </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={deals.map(d => d._id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deals.map((deal) => (
              <SortableDealCard 
                 key={deal._id}
                 deal={deal}
                 onEdit={() => { setEditTarget(deal); setModalOpen(true); }}
                 onDelete={() => setDeleteTarget(deal)}
              />
            ))}
            {deals.length === 0 && (
               <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-muted-foreground border border-dashed rounded-2xl">
                  No deals found. Add a new premium deal to display on the hero section.
               </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
