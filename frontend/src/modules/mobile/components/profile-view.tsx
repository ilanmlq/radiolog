import { useState } from "react"
import {
  Shield,
  Pencil,
  Phone,
  Mail,
  Radio,
  LogOut,
  Bell,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useAuth } from '@/hooks/use-auth'
import { useEvent } from '@/modules/events'
import { useOrganisation } from '@/modules/organisations'
import { EventCard } from '@/modules/events/components/event-card'
import { useApi } from "@/hooks/use-api"
import { useToast } from "@/hooks/use-toast"

function InfoRow({
  icon: Icon,
  label,
  value,
  muted = false,
}: {
  icon: typeof Phone
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span
          className={
            muted
              ? "text-sm text-muted-foreground italic"
              : "text-sm font-medium text-foreground"
          }
        >
          {value}
        </span>
      </div>
    </div>
  )
}

// ── Edit drawer ────────────────────────────────────────────────────
function EditDrawer() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name)
  const [email, setEmail] = useState(user?.email)
  const [open, setOpen] = useState(false)

  function handleSave() {
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Pencil className="size-3.5" />
          Modifier
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Modifier mes informations</DrawerTitle>
          <DrawerDescription>
            Informations de l'utilisateur connecté
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-email">E-mail</Label>
            <Input
              id="edit-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleSave}>Enregistrer</Button>
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ── Notification section ────────────────────────────
export function NotificationSection() {
  const api = useApi();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [linked, setLinked] = useState(false);

  const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME;
  const hasBotUsernameProvided = Boolean(TELEGRAM_BOT_USERNAME);

  const handleActivate = async () => {

    setLoading(true);

    try {
      const { data } = await api.get("/notifications/token");

      const token = data.token;

      if (!token) {
        throw new Error("Token manquant");
      }

      const telegramUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${token}`;
      window.open(telegramUrl, "_blank");

      toast({
        title: "Telegram ouvert",
        description: "Terminez la liaison dans Telegram.",
      });

      setLinked(true);

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setLinked(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
          <Bell className="size-4 text-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">
          Notifications Telegram
        </h3>
      </div>

      {/* Content */}
      <div className="mt-4">
        {hasBotUsernameProvided ? (
          <>
          {!linked ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/50 px-6 py-6 text-center">
              <p className="mb-4 text-xs text-muted-foreground">
                Recevez des alertes directement sur Telegram.
              </p>

              <Button onClick={handleActivate} disabled={loading}>
                {loading ? "Activation..." : "Activer les notifications"}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm font-semibold text-primary">
                Lien en cours de finalisation
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Terminez la liaison dans Telegram si ce n’est pas déjà fait.
              </p>

              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-[10px]"
                onClick={handleReset}
              >
                Reconfigurer
              </Button>
            </div>
          )}
          </>
        ) : (
          <h1></h1>
        )}

        {!linked ? (
          <>
          <div className="rounded-xl border border-dashed border-border bg-muted/50 px-6 py-6 text-center">
            <p className="mb-4 text-xs text-muted-foreground">
              Recevez des alertes directement sur Telegram.
            </p>

          {hasBotUsernameProvided ? (
            <Button onClick={handleActivate} disabled={loading}>
              {loading ? "Activation..." : "Activer les notifications"}
            </Button>
          ): (
            <p className="text-sm font-medium text-destructive">
              Notifications non configurées.
            </p>
          )}
            
          </div>
          </>
        ) : (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm font-semibold text-primary">
              Lien en cours de finalisation
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Terminez la liaison dans Telegram si ce n’est pas déjà fait.
            </p>

            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-[10px]"
              onClick={handleReset}
            >
              Reconfigurer
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Main profile view ──────────────────────────────────────────────
export function ProfileView() {
  const { user, logout } = useAuth()
  const { activeEventId } = useOrganisation()
  const { events } = useEvent()

  const activeEvent = events.find(event => event.id === activeEventId)

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 py-5">

      {activeEvent && <EventCard event={activeEvent} />}

      {/* ── Personal information ──────────────────────── */}
      <section className="rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {user?.name}
              </h3>
              <Badge
                variant="secondary"
                className="mt-0.5 text-[10px] font-semibold"
              >
                Utilisateur
              </Badge>
            </div>
          </div>
          <EditDrawer />
        </div>

        <div className="px-4 pb-4">
          <InfoRow
            icon={Mail}
            label="E-mail"
            value={user?.email || "Non renseigné"}
          />
        </div>
      </section>

      {/* ── Radio assignment ──────────────────────────── */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent">
              <Radio className="size-4 text-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Radio attribuée
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/50 px-6 py-4">
          <p className="text-xs font-medium text-muted-foreground">
            Bientot disponible
          </p>
        </div>

      </section>

      {/* ── Notification assignment ──────────────────────────── */}
      <NotificationSection />

      {/* ── Actions ──────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <Button variant="outline" className="gap-2" asChild>
          <Link to="/admin">
            <Shield className="size-4" />
            {"Acceder a l'administration"}
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-2 size-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  )
}
