// Language exams an essay can be written for. The backend checks an essay with the exam's own rules
// when its format is set; names and task texts are in the exam's language and never translated

export type EssayExam = "Dtz" | "Dtb" | "Norskprove" | "Ielts";
export type EssayKind = "Essay" | "Letter";
export type EssayLevel = "A1" | "A2" | "B1" | "B2";

export interface IEssayFormat {
  exam: EssayExam;
  level: EssayLevel;
  kind: EssayKind;
}

export interface IExamTopic {
  // Shown in the list
  title: string;
  // Becomes the task of the essay
  task: string;
}

interface IExamInfo {
  // The exam's own name, never translated
  name: string;
  short: string;
  // Language of the exam, in that language
  language: string;
  levels: EssayLevel[];
  kinds: EssayKind[];
  // What the exam expects, per kind: minutes and a minimum of words (null when the exam sets none)
  facts: Record<EssayKind, { minutes: number | null; minWords: (level: EssayLevel) => number | null }>;
}

export const ESSAY_EXAMS: Record<EssayExam, IExamInfo> = {
  Dtz: {
    name: "Deutsch-Test für Zuwanderer",
    short: "DTZ",
    language: "Deutsch",
    levels: ["A2", "B1"],
    kinds: ["Letter"],
    facts: {
      Letter: { minutes: 30, minWords: () => null },
      Essay: { minutes: null, minWords: () => null },
    },
  },
  Dtb: {
    name: "Deutsch-Test für den Beruf B2",
    short: "DTB",
    language: "Deutsch",
    levels: ["B2"],
    kinds: ["Letter"],
    facts: {
      Letter: { minutes: 30, minWords: () => null },
      Essay: { minutes: null, minWords: () => null },
    },
  },
  Norskprove: {
    name: "Norskprøve",
    short: "Norskprøve",
    language: "Norsk",
    levels: ["A1", "A2", "B1", "B2"],
    kinds: ["Essay", "Letter"],
    facts: {
      Letter: { minutes: null, minWords: (level) => (level === "B1" || level === "B2" ? 80 : null) },
      Essay: { minutes: null, minWords: (level) => (level === "A1" ? null : 80) },
    },
  },
  Ielts: {
    name: "IELTS General Training",
    short: "IELTS",
    language: "English",
    levels: ["B1", "B2"],
    kinds: ["Essay", "Letter"],
    facts: {
      Letter: { minutes: 20, minWords: () => 150 },
      Essay: { minutes: 40, minWords: () => 250 },
    },
  },
};

// The picker shows exams by language; within one, each level belongs to one exam (German B2 is the DTB)
export const ESSAY_EXAM_GROUPS: { language: string; exams: EssayExam[] }[] = [
  { language: "Deutsch", exams: ["Dtz", "Dtb"] },
  { language: "Norsk", exams: ["Norskprove"] },
  { language: "English", exams: ["Ielts"] },
];

const isExam = (value: string): value is EssayExam => value in ESSAY_EXAMS;

// "Ielts/B2/Letter", as the backend stores it; anything else is a general essay
export const parseEssayFormat = (code?: string | null): IEssayFormat | null => {
  const [exam, level, kind] = code?.split("/") ?? [];
  if (!exam || !isExam(exam)) return null;
  const info = ESSAY_EXAMS[exam];
  if (!info.levels.includes(level as EssayLevel) || !info.kinds.includes(kind as EssayKind)) return null;
  return { exam, level: level as EssayLevel, kind: kind as EssayKind };
};

export const essayFormatCode = (format: IEssayFormat): string => `${format.exam}/${format.level}/${format.kind}`;

export const essayFormatMinWords = (format: IEssayFormat | null): number | null =>
  format ? ESSAY_EXAMS[format.exam].facts[format.kind].minWords(format.level) : null;

type TopicTable = Partial<Record<EssayLevel, Partial<Record<EssayKind, IExamTopic[]>>>>;

const dtbMail = (situation: string, points: string[]) =>
  `${situation}\n\nSchreiben Sie eine E-Mail. Gehen Sie auf alle Punkte ein:\n${points.map((point) => `– ${point}`).join("\n")}\n\nDenken Sie an Betreff, Anrede und Gruß.`;

const ieltsLetter = (situation: string, reader: string, points: string[], opening: string) =>
  `${situation}\n\nWrite a letter to ${reader}. In your letter\n${points.map((point) => `• ${point}`).join("\n")}\n\nWrite at least 150 words. You do NOT need to write any addresses.\nBegin your letter as follows: ${opening}`;

const ieltsEssay = (question: string) =>
  `${question}\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\nWrite at least 250 words.`;

const dtzLetter = (situation: string, points: string[]) =>
  `${situation}\n\nSchreiben Sie etwas zu folgenden Punkten:\n${points.map((point) => `– ${point}`).join("\n")}\n\nVergessen Sie nicht die Anrede und den Gruß am Schluss.`;

// Situations and questions of the kind these exams really set, written in their format
export const EXAM_TOPICS: Record<EssayExam, TopicTable> = {
  Dtz: {
    A2: {
      Letter: [
        {
          title: "E-Mail an die Kursleiterin: Sie können nicht kommen",
          task: dtzLetter("Sie können nächste Woche nicht zum Deutschkurs kommen. Schreiben Sie eine E-Mail an Ihre Kursleiterin, Frau Weber.", [
            "Grund",
            "wie lange Sie fehlen",
            "Bitte um die Hausaufgaben",
            "wann Sie wiederkommen",
          ]),
        },
        {
          title: "Einladung zum Geburtstag",
          task: dtzLetter("Sie feiern Ihren Geburtstag. Schreiben Sie Ihrer Freundin Anna eine Einladung.", [
            "wann und wo",
            "wer kommt",
            "was Anna mitbringen kann",
            "wie man zu Ihnen kommt",
          ]),
        },
        {
          title: "Brief an den Vermieter: Die Heizung ist kaputt",
          task: dtzLetter("In Ihrer Wohnung funktioniert die Heizung nicht. Schreiben Sie an Ihren Vermieter, Herrn Schulz.", [
            "seit wann",
            "welches Problem",
            "Bitte um Reparatur",
            "wann Sie zu Hause sind",
          ]),
        },
        {
          title: "Nachricht an die Lehrerin: Ihr Kind ist krank",
          task: dtzLetter("Ihr Sohn ist krank und kann morgen nicht in die Schule gehen. Schreiben Sie an seine Klassenlehrerin, Frau Klein.", [
            "was Ihr Sohn hat",
            "wie lange er fehlt",
            "Hausaufgaben",
            "Frage zum Ausflug am Freitag",
          ]),
        },
        {
          title: "Absage an einen Freund: Hilfe beim Umzug",
          task: dtzLetter("Ihr Freund Paul zieht am Samstag um und hat Sie um Hilfe gebeten. Sie haben aber keine Zeit. Schreiben Sie Paul eine E-Mail.", [
            "Entschuldigung",
            "Grund",
            "einen anderen Tag vorschlagen",
            "andere Hilfe anbieten",
          ]),
        },
      ],
    },
    B1: {
      Letter: [
        {
          title: "Reklamation: Die Waschmaschine ist kaputt angekommen",
          task: dtzLetter("Sie haben im Internet eine Waschmaschine bestellt. Sie ist kaputt bei Ihnen angekommen. Schreiben Sie an den Kundenservice.", [
            "was und wann Sie bestellt haben",
            "das Problem",
            "was Sie jetzt möchten (Umtausch oder Geld zurück)",
            "bis wann Sie eine Antwort erwarten",
          ]),
        },
        {
          title: "Urlaubsantrag an die Chefin",
          task: dtzLetter("Sie möchten im August zwei Wochen Urlaub nehmen. Schreiben Sie an Ihre Chefin, Frau Müller.", [
            "wann genau",
            "Grund für den Urlaub",
            "wer Ihre Arbeit übernehmen kann",
            "Bitte um eine schnelle Antwort",
          ]),
        },
        {
          title: "Termin beim Bürgeramt verschieben",
          task: dtzLetter("Sie haben nächsten Montag einen Termin beim Bürgeramt, können aber nicht kommen. Schreiben Sie an das Bürgeramt.", [
            "Ihr Termin und Grund für die Absage",
            "neuer Termin",
            "welche Unterlagen Sie mitbringen sollen",
            "Frage nach den Öffnungszeiten",
          ]),
        },
        {
          title: "Anfrage an die Volkshochschule: Computerkurs",
          task: dtzLetter("Sie haben in der Zeitung eine Anzeige für einen Computerkurs an der Volkshochschule gelesen. Schreiben Sie an die Volkshochschule.", [
            "warum Sie sich für den Kurs interessieren",
            "Kurszeiten",
            "Kosten und Ermäßigung",
            "Kinderbetreuung während des Kurses",
          ]),
        },
        {
          title: "Beschwerde an die Hausverwaltung: Lärm",
          task: dtzLetter("Ihre Nachbarn feiern oft bis spät in die Nacht und sind sehr laut. Schreiben Sie an die Hausverwaltung.", [
            "das Problem",
            "seit wann",
            "Folgen für Sie und Ihre Familie",
            "was die Hausverwaltung tun soll",
          ]),
        },
      ],
    },
  },
  Dtb: {
    B2: {
      Letter: [
        {
          title: "Beschwerde an die IT-Abteilung: Der Computer fällt ständig aus",
          task: dtbMail("Ihr Computer bei der Arbeit stürzt seit einer Woche mehrmals am Tag ab. Schreiben Sie eine E-Mail an die IT-Abteilung.", [
            "das Problem genau beschreiben",
            "Folgen für Ihre Arbeit",
            "was Sie schon selbst versucht haben",
            "Lösungsvorschlag und möglicher Termin",
          ]),
        },
        {
          title: "Rückmeldung an die Teamleiterin: Neuer Schichtplan",
          task: dtbMail("Ihre Teamleiterin, Frau Wagner, möchte die Schichten ab nächstem Monat neu verteilen und bittet das Team per E-Mail um eine Rückmeldung.", [
            "Ihre Meinung zum neuen Plan",
            "Vor- und Nachteile für Sie",
            "ein eigener Vorschlag",
            "Bitte um ein Gespräch",
          ]),
        },
        {
          title: "Antwort an einen Kunden: Die Lieferung ist zu spät",
          task: dtbMail("Sie arbeiten im Kundenservice eines Möbelhauses. Ein Kunde, Herr Yilmaz, beschwert sich per E-Mail, weil seine Lieferung schon zwei Wochen zu spät ist. Antworten Sie ihm.", [
            "Entschuldigung",
            "Grund für die Verspätung",
            "neuer Liefertermin",
            "Angebot als Entschädigung",
          ]),
        },
        {
          title: "Antrag auf eine Weiterbildung",
          task: dtbMail("Sie möchten an einer Weiterbildung teilnehmen. Schreiben Sie eine E-Mail an Ihren Vorgesetzten, Herrn Becker.", [
            "welche Weiterbildung und wann",
            "warum sie für Ihre Arbeit wichtig ist",
            "Kosten und Arbeitszeit",
            "wer Sie in dieser Zeit vertritt",
          ]),
        },
        {
          title: "Einarbeitung einer neuen Kollegin",
          task: dtbMail("Nächste Woche beginnt eine neue Kollegin, Frau Novak, in Ihrem Team. Ihre Chefin bittet Sie, die Einarbeitung zu organisieren. Schreiben Sie Frau Novak eine E-Mail.", [
            "Begrüßung und Ihre Rolle",
            "Ablauf der ersten Woche",
            "was sie mitbringen soll",
            "Ansprechpartner bei Fragen",
          ]),
        },
      ],
    },
  },
  Norskprove: {
    A1: {
      Letter: [
        { title: "Melding til læreren: Du er syk", task: "Du er syk og kan ikke komme på norskkurset i dag. Skriv en melding til læreren din." },
        { title: "Melding til en venn: Kino på lørdag", task: "Du skal på kino med en venn på lørdag. Skriv en melding til vennen din. Skriv hvilken film dere skal se, og når og hvor dere skal møtes." },
        { title: "Melding til sjefen: Du kommer for sent", task: "Du kommer for sent på jobb i dag. Skriv en melding til sjefen din. Skriv hvorfor, og når du kommer." },
        { title: "Melding til naboen: Du skal på ferie", task: "Du skal på ferie i to uker. Skriv en melding til naboen din. Spør om naboen kan ta inn posten din." },
        { title: "Melding til en venn: Middag hos deg", task: "Du vil invitere en venn på middag. Skriv en melding. Skriv hvilken dag, når, og hva dere skal spise." },
      ],
      Essay: [
        { title: "Familien min", task: "Skriv om familien din. Hvem er i familien din? Hvor bor de? Hva liker dere å gjøre sammen?" },
        { title: "En vanlig dag", task: "Skriv om en vanlig dag for deg. Når står du opp? Hva gjør du om dagen og om kvelden?" },
        { title: "Der jeg bor", task: "Skriv om leiligheten eller huset ditt. Hvor bor du? Hvor mange rom er det? Hva liker du best?" },
        { title: "Mat jeg liker", task: "Skriv om mat. Hva liker du å spise? Hva spiser du til frokost og middag? Lager du mat selv?" },
        { title: "Fritiden min", task: "Skriv om fritiden din. Hva liker du å gjøre når du har fri? Hvem er du sammen med?" },
      ],
    },
    A2: {
      Letter: [
        { title: "E-post til butikken: Jakken er for liten", task: "Du har kjøpt en jakke på nettet, men den er for liten. Skriv en e-post til butikken. Fortell hva du har kjøpt, hva som er problemet, og hva du vil at butikken skal gjøre." },
        { title: "E-post til en venn som kommer på besøk", task: "En venn skal besøke deg neste helg. Skriv en e-post til vennen din. Fortell hva dere kan gjøre sammen, og hva vennen bør ta med." },
        { title: "E-post om et kurs", task: "Du vil begynne på et svømmekurs. Skriv en e-post til svømmehallen. Spør om når kurset er, hva det koster, og hvordan du melder deg på." },
        { title: "E-post til barnehagen", task: "Barnet ditt er sykt og blir hjemme fra barnehagen i dag. Skriv en e-post til barnehagen. Fortell hva som er galt, og når barnet kommer tilbake." },
        { title: "E-post til en venn: Ny leilighet", task: "Du har flyttet til en ny leilighet. Skriv en e-post til en venn. Fortell om leiligheten og om nabolaget, og inviter vennen på besøk." },
      ],
      Essay: [
        { title: "En ferie jeg husker", task: "Skriv om en ferie du husker godt. Hvor var du? Hvem var du sammen med? Hva gjorde dere, og hvorfor husker du denne ferien?" },
        { title: "Jobben min", task: "Skriv om jobben din eller om en jobb du vil ha. Hva gjør du på jobben? Hva liker du, og hva liker du ikke?" },
        { title: "Været og årstidene", task: "Skriv om været og årstidene i Norge og i hjemlandet ditt. Hva er likt, og hva er forskjellig? Hvilken årstid liker du best?" },
        { title: "En fest i hjemlandet mitt", task: "Skriv om en høytid eller fest i hjemlandet ditt. Hva skjer på denne dagen? Hva spiser dere, og hva gjør dere?" },
        { title: "Hvordan jeg lærer norsk", task: "Skriv om hvordan du lærer norsk. Hva gjør du for å lære? Hva er lett, og hva er vanskelig?" },
      ],
    },
    B1: {
      Letter: [
        { title: "E-post til styret i borettslaget: Søppel", task: "Det står ofte søppelposer ved inngangen til blokka di. Skriv en e-post til styret i borettslaget. Forklar problemet, si hva du mener, og foreslå en løsning. Skriv minst 80 ord." },
        { title: "Klage til treningssenteret", task: "Treningssenteret ditt har økt prisen og kortet ned åpningstidene. Skriv en e-post til treningssenteret. Forklar hvorfor du er misfornøyd, og hva du vil at de skal gjøre. Skriv minst 80 ord." },
        { title: "Klage til busselskapet", task: "Bussen du tar til jobben, kommer ofte for sent. Skriv en e-post til busselskapet. Fortell hva som skjer, hvilke problemer det gir deg, og hva du mener de bør gjøre. Skriv minst 80 ord." },
        { title: "E-post til kommunen: Biblioteket skal legges ned", task: "Kommunen vil legge ned biblioteket i bydelen din. Skriv en e-post til kommunen. Si hva du mener, og begrunn meningen din. Skriv minst 80 ord." },
        { title: "E-post til rektor: Skoledagen skal starte tidligere", task: "Skolen til barnet ditt vil at skoledagen skal starte klokka 08.00 i stedet for 08.30. Skriv en e-post til rektor. Si hva du mener om dette, og begrunn meningen din. Skriv minst 80 ord." },
      ],
      Essay: [
        { title: "En person som har betydd mye for meg", task: "Skriv om en person som har betydd mye for deg. Hvem er personen? Hva har dere opplevd sammen? Hvorfor er denne personen viktig for deg? Skriv minst 80 ord." },
        { title: "Å trives på jobben", task: "Hva er viktig for at man skal trives på en arbeidsplass? Skriv hva du mener, og begrunn meningen din med eksempler. Skriv minst 80 ord." },
        { title: "Livet i Norge og i hjemlandet mitt", task: "Skriv om forskjeller mellom livet i Norge og livet i hjemlandet ditt. Hva synes du er bra i Norge, og hva savner du? Skriv minst 80 ord." },
        { title: "Å få venner i et nytt land", task: "Hvordan kan man få nye venner når man flytter til et nytt land? Skriv om dine erfaringer og gi råd. Skriv minst 80 ord." },
        { title: "Mobiltelefonen i hverdagen", task: "Mange bruker mobiltelefonen hele dagen. Skriv om fordeler og ulemper med dette, og si hva du selv mener. Skriv minst 80 ord." },
      ],
    },
    B2: {
      Letter: [
        { title: "E-post til ledelsen: Åpent kontorlandskap", task: "Arbeidsgiveren din vil fjerne kontorene og innføre åpent kontorlandskap. Skriv en e-post til ledelsen. Si hva du mener, og begrunn meningen din med argumenter." },
        { title: "Klage på strømregningen", task: "Du har fått en strømregning som er mye høyere enn vanlig. Skriv en klage til strømselskapet. Forklar situasjonen, argumenter for at regningen er feil, og si hva du krever." },
        { title: "E-post til kommunen: Ny vei gjennom friområdet", task: "Kommunen planlegger å bygge en ny vei gjennom et friområde nær hjemmet ditt. Skriv en e-post til kommunen. Ta stilling til planen, og begrunn synet ditt." },
        { title: "Klage til flyselskapet: Innstilt fly", task: "Flyet ditt ble innstilt, og du fikk verken informasjon eller hjelp. Skriv en klage til flyselskapet. Beskriv hva som skjedde, og argumenter for at du skal få kompensasjon." },
        { title: "E-post til styret: Forbud mot kjæledyr", task: "Styret i borettslaget vil forby hunder og katter i leilighetene. Skriv en e-post til styret. Argumenter for ditt syn på saken." },
      ],
      Essay: [
        { title: "Gratis kollektivtransport for alle?", task: "Bør kollektivtransport være gratis for alle? Argumenter for ditt syn." },
        { title: "Mobiltelefon på skolen", task: "Bør elever få lov til å bruke mobiltelefon på skolen? Argumenter for ditt syn." },
        { title: "Hjemmekontor eller kontor?", task: "Er det bedre å jobbe hjemmefra enn å jobbe på kontoret? Argumenter for ditt syn." },
        { title: "Skal alle som bor i Norge, lære norsk?", task: "Bør alle som flytter til Norge, måtte lære norsk? Argumenter for ditt syn." },
        { title: "Dyrere kjøtt for klimaets skyld?", task: "Noen mener at kjøtt bør bli dyrere for å beskytte klimaet. Hva mener du? Argumenter for ditt syn." },
      ],
    },
  },
  Ielts: {
    B1: {
      Letter: [
        {
          title: "Lost bag at a hotel",
          task: ieltsLetter("You recently stayed at a hotel and left a bag in your room.", "the hotel manager", [
            "describe the bag and what was in it",
            "explain when and where you think you left it",
            "say what you would like the manager to do",
          ], "Dear Sir or Madam,"),
        },
        {
          title: "Can't come to a friend's wedding",
          task: ieltsLetter("A friend has invited you to their wedding, but you cannot go.", "your friend", [
            "thank your friend for the invitation",
            "explain why you cannot go",
            "suggest a time when you could meet",
          ], "Dear ...,"),
        },
        {
          title: "Joining an evening class",
          task: ieltsLetter("You would like to join an evening class at a local college.", "the college", [
            "say which class you are interested in",
            "explain why you want to take this class",
            "ask about the times and the fees",
          ], "Dear Sir or Madam,"),
        },
        {
          title: "A neighbour's noisy dog",
          task: ieltsLetter("Your neighbour's dog barks for most of the day while your neighbour is at work.", "your neighbour", [
            "explain the problem",
            "describe how it affects you",
            "suggest a solution",
          ], "Dear ...,"),
        },
        {
          title: "You have moved to a new home",
          task: ieltsLetter("You have just moved to a new home.", "an English-speaking friend", [
            "describe your new home",
            "explain why you moved",
            "invite your friend to visit",
          ], "Dear ...,"),
        },
      ],
      Essay: [
        { title: "City or small town", task: ieltsEssay("Some people prefer to live in a big city, while others prefer to live in a small town.\n\nDiscuss both views and give your own opinion.") },
        { title: "Shopping online", task: ieltsEssay("Many people now buy most things online instead of in shops.\n\nWhat are the advantages and disadvantages of this?") },
        { title: "Children and screens", task: ieltsEssay("Children today spend a lot of time watching screens.\n\nWhat problems does this cause? What can parents do about it?") },
        { title: "Cooking lessons at school", task: ieltsEssay("Some people think that all children should learn to cook at school.\n\nDo you agree or disagree?") },
        { title: "Living longer", task: ieltsEssay("In many countries, people are living longer than before.\n\nIs this a positive or a negative development?") },
      ],
    },
    B2: {
      Letter: [
        {
          title: "Asking to change your working hours",
          task: ieltsLetter("You would like to change your working hours.", "your manager", [
            "explain why you want to change your hours",
            "say what hours you would like to work",
            "explain how this will affect your work",
          ], "Dear ...,"),
        },
        {
          title: "A product that was not as described",
          task: ieltsLetter("You recently bought a product online, but it was not as described on the website.", "the company", [
            "give details of what you bought",
            "explain how it was different from the description",
            "say what you want the company to do",
          ], "Dear Sir or Madam,"),
        },
        {
          title: "The council plans to close a sports centre",
          task: ieltsLetter("Your local council is planning to close the sports centre in your area.", "the council", [
            "explain how you use the sports centre",
            "say why it is important to local people",
            "suggest what the council could do instead",
          ], "Dear Sir or Madam,"),
        },
        {
          title: "Problems with a group trip",
          task: ieltsLetter("You organised a trip for your colleagues through a travel agency, and there were several problems.", "the travel agency", [
            "describe the trip you booked",
            "explain what went wrong",
            "say what you expect the agency to do",
          ], "Dear Sir or Madam,"),
        },
        {
          title: "A colleague is coming from abroad",
          task: ieltsLetter("A colleague from another country is coming to work in your office for a month.", "your colleague", [
            "offer to help with accommodation",
            "describe what the office and the work are like",
            "suggest some things to do in your free time",
          ], "Dear ...,"),
        },
      ],
      Essay: [
        { title: "Working from home", task: ieltsEssay("Some people believe that working from home is better for employees, while others think it harms teamwork.\n\nDiscuss both views and give your own opinion.") },
        { title: "Public transport or new roads", task: ieltsEssay("Governments should spend money on public transport rather than on building new roads.\n\nTo what extent do you agree or disagree?") },
        { title: "Young people leaving the countryside", task: ieltsEssay("In many countries, young people are leaving rural areas to live in cities.\n\nWhy is this happening? What can be done to solve this problem?") },
        { title: "Compulsory community service", task: ieltsEssay("Some people think that unpaid community service should be a compulsory part of high school programmes.\n\nTo what extent do you agree or disagree?") },
        { title: "Advertising and what we buy", task: ieltsEssay("Advertising encourages people to buy things they do not really need.\n\nTo what extent do you agree or disagree?") },
      ],
    },
  },
};
