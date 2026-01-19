import React from 'react';
import LegalPageLayout from '../components/LegalPageLayout';

export default function VerzendRetourbeleid() {
  return (
    <LegalPageLayout
      title="Verzend- en Retourbeleid"
      description="Lees het verzend- en retourbeleid van Bereschoon."
      breadcrumbs={[
        { name: 'Home', url: 'https://bereschoon.nl' },
        { name: 'Verzend- en Retourbeleid', url: 'https://bereschoon.nl/verzend-retourbeleid' },
      ]}
      badge="Webshop"
    >
      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 1 Algemeen</h2>
            <p className="mb-2"><strong>1.1</strong> Dit verzend- en retourbeleid maakt onlosmakelijk deel uit van de Algemene Voorwaarden van Bereschoon en is van toepassing op alle bestellingen die via de webshop of anderszins worden geplaatst.</p>
            <p className="mb-2"><strong>1.2</strong> In dit beleid wordt onderscheid gemaakt tussen de 'Consument' (particuliere klant) en de 'Zakelijke Klant' (bedrijven/beroepsuitoefening). Waar 'Klant' staat, geldt dit voor beiden.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 2 Verzending en Levering</h2>
            <p className="mb-2"><strong>2.1</strong> Bereschoon streeft ernaar bestellingen die op werkdagen vóór 15:00 uur zijn geplaatst en betaald, dezelfde dag te verwerken en aan te bieden aan de vervoerder.</p>
            <p className="mb-2"><strong>2.2</strong> De genoemde levertijden op de website (doorgaans 1 tot 3 werkdagen binnen Nederland) zijn indicatief en gelden nimmer als fatale termijn. Vertraging in de levering geeft geen recht op schadevergoeding.</p>
            <p className="mb-2"><strong>2.3</strong> Het risico van verlies of beschadiging van de producten gaat bij Consumenten over op het moment van bezorging. Bij zakelijke klanten gaat het risico over op het moment dat de producten het magazijn van Bereschoon verlaten en zijn overgedragen aan de vervoerder.</p>
            <p className="mb-2"><strong>2.4</strong> Indien een pakket niet kan worden afgeleverd door toedoen van de Klant (foutief adres of herhaaldelijk niet thuis), behoudt Bereschoon zich het recht voor om de kosten voor retourzending naar het magazijn en het eventueel opnieuw verzenden in rekening te brengen.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 3 Retourneren door Consumenten (Herroepingsrecht)</h2>
            <p className="mb-2"><strong>3.1</strong> De Consument heeft het recht om binnen een termijn van 14 dagen zonder opgave van redenen de overeenkomst te herroepen. De herroepingstermijn verstrijkt 14 dagen na de dag waarop de consument, of een door hem aangewezen derde, het product fysiek in bezit krijgt.</p>
            <p className="mb-2"><strong>3.2</strong> Om het herroepingsrecht uit te oefenen, moet de Consument Bereschoon via een ondubbelzinnige verklaring (schriftelijk per post of e-mail) op de hoogte stellen.</p>
            <p className="mb-2"><strong>3.3</strong> Als de Consument gebruik maakt van zijn herroepingsrecht, ontvangt hij alle betalingen die hij tot op dat moment heeft gedaan, inclusief leveringskosten (met uitzondering van extra kosten ten gevolge van een duurdere verzendoptie dan de standaardlevering) onverwijld terug.</p>
            <p className="mb-2"><strong>3.4</strong> De directe kosten voor het terugzenden van de goederen komen voor rekening van de consument.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 4 Retourneren door Zakelijke Klanten (B2B)</h2>
            <p className="mb-2"><strong>4.1</strong> Voor zakelijke klanten geldt geen wettelijk herroepingsrecht of bedenktermijn. De verkoop is na bestelling en betaling definitief.</p>
            <p className="mb-2"><strong>4.2</strong> Retourneren van goederen door zakelijke klanten is uitsluitend mogelijk na voorafgaande schriftelijke toestemming van Bereschoon. Bereschoon is niet verplicht retourverzoeken zonder opgave van geldige reden (zoals een defect) te accepteren.</p>
            <p className="mb-2"><strong>4.3</strong> Indien Bereschoon uit coulance instemt met een zakelijke retour, geldt dat de producten in absolute nieuwstaat, ongeopend en in de originele verpakking moeten verkeren.</p>
            <p className="mb-2"><strong>4.4</strong> Bij een geaccepteerde zakelijke retour (anders dan bij defecten/fouten van Bereschoon) worden 'restockingkosten' in rekening gebracht ter hoogte van 20% van het aankoopbedrag, ter dekking van de administratieve en logistieke afhandeling. De verzendkosten voor zowel de heenzending als de retourzending zijn voor rekening van de Zakelijke Klant.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 5 Uitzonderingen Retourrecht (Verzegeling & Chemie)</h2>
            <p className="mb-2"><strong>5.1</strong> Zowel voor consumenten als voor zakelijke klanten geldt dat het recht op retournering vervalt indien de verzegeling van producten is verbroken.</p>
            <p className="mb-2"><strong>5.2</strong> Onder verzegeling wordt verstaan: de seal op de dop, de garantiering van de dop, of de afgesloten folieverpakking.</p>
            <p className="mb-2"><strong>5.3</strong> Aangezien Bereschoon chemische reinigingsproducten en vloeistoffen verkoopt, kan de veiligheid en kwaliteit van de inhoud na opening niet meer gegarandeerd worden. Geopende flessen, jerrycans of emmers worden om veiligheidsredenen nooit teruggenomen.</p>
            <p className="mb-2"><strong>5.4</strong> Indien een klant een product met verbroken verzegeling toch retourneert, wordt de retourzending geweigerd. Het product wordt vernietigd of op kosten van de klant teruggestuurd; er vindt geen terugbetaling plaats.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 6 Meldplicht Schade en Gebreken</h2>
            <p className="mb-2"><strong>6.1</strong> De Klant dient de geleverde producten direct na ontvangst te controleren op eventuele beschadigingen, lekkage of tekortkomingen.</p>
            <p className="mb-2"><strong>6.2</strong> Zakelijke Klanten dienen zichtbare gebreken of manco's uiterlijk binnen 24 uur na levering schriftelijk (inclusief foto's) te melden bij Bereschoon. Na deze termijn wordt de levering geacht te zijn geaccepteerd en goedgekeurd.</p>
            <p className="mb-2"><strong>6.3</strong> Consumenten dienen gebreken binnen bekwame tijd na ontdekking, doch bij voorkeur binnen 48 uur na ontvangst in verband met de bewijslast bij transportschade, te melden.</p>
            <p className="mb-2"><strong>6.4</strong> In geval van lekkage van chemische vloeistoffen tijdens transport dient de klant direct foto's te maken van de verpakking (binnen en buiten) en het product, en deze te sturen naar de klantenservice alvorens enige actie te ondernemen.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 7 Verpakkingsinstructies bij Retour</h2>
            <p className="mb-2"><strong>7.1</strong> De klant is verantwoordelijk voor een deugdelijke verpakking van de retourzending.</p>
            <p className="mb-2"><strong>7.2</strong> Aangezien het vloeistoffen en chemische middelen betreft, dient de klant ervoor te zorgen dat de producten rechtopstaand, lekdicht en stootvast worden verpakt. Gebruik bij voorkeur de originele doos met opvulmateriaal.</p>
            <p className="mb-2"><strong>7.3</strong> Indien een retourzending tijdens het transport beschadigt of gaat lekken door ondeugdelijke verpakking door de Klant, vervalt het recht op terugbetaling en wordt de Klant aansprakelijk gesteld voor eventuele schade aan derden of vervoerders.</p>
      </article>

      <article className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 mt-8">Artikel 8 Terugbetaling</h2>
            <p className="mb-2"><strong>8.1</strong> Terugbetaling aan consumenten geschiedt binnen 14 dagen na aanmelding van de retour, mits de goederen in goede orde retour zijn ontvangen door Bereschoon.</p>
            <p className="mb-2"><strong>8.2</strong> Terugbetaling aan zakelijke klanten (indien van toepassing) geschiedt binnen 14 dagen na ontvangst en inspectie van de goederen, onder aftrek van de in artikel 4.4 genoemde kosten.</p>
            <p className="mb-2"><strong>8.3</strong> Bereschoon gebruikt voor terugbetaling hetzelfde betaalmiddel dat de Klant heeft gebruikt, tenzij anders overeengekomen.</p>
      </article>
    </LegalPageLayout>
  );
}
