"use client";

import { Checkbox, Field, Input, Select, Switch, Textarea } from "@/components/ui/form";

export function FormSpecimen() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Field label="Firmenname" hint="So wie im Handelsregister eingetragen.">
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} placeholder="Muster GmbH" />
        )}
      </Field>
      <Field label="E-Mail-Adresse" error="Bitte geben Sie eine gültige E-Mail-Adresse ein.">
        {({ id, describedBy, invalid }) => (
          <Input
            id={id}
            type="email"
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            defaultValue="name@"
          />
        )}
      </Field>
      <Field label="Teamgröße">
        {({ id, describedBy }) => (
          <Select id={id} aria-describedby={describedBy} defaultValue="2-9">
            <option value="1">Nur ich</option>
            <option value="2-9">2 bis 9 Personen</option>
            <option value="10-49">10 bis 49 Personen</option>
            <option value="50+">50 oder mehr</option>
          </Select>
        )}
      </Field>
      <Field label="Nachricht" optional>
        {({ id, describedBy }) => <Textarea id={id} aria-describedby={describedBy} />}
      </Field>
      <div className="flex flex-col gap-4">
        <Checkbox
          label="DATEV-Export erforderlich"
          description="Ihr Steuerberater arbeitet mit DATEV."
          defaultChecked
        />
        <Checkbox label="E-Rechnung senden" />
      </div>
      <div className="flex flex-col gap-2">
        <Switch label="Nur Anbieter mit Servern in Deutschland" />
        <Switch label="Kostenloser Tarif" defaultChecked />
      </div>
    </div>
  );
}
