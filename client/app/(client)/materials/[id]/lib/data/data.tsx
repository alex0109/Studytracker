import {
  LuBookCheck,
  LuNotebookPen,
  LuBrain,
  LuPlay,
  LuPlus,
} from "react-icons/lu";
import {
  assessmentInterfaceType,
  materialInterfaceType,
} from "../types/data.types";

export const materialInterface: materialInterfaceType[] = [
  { key: 943, name: "Materials", icon: <LuNotebookPen /> },
  { key: 142, name: "Assessment", icon: <LuBookCheck /> },
];

export const assessmentInterface: assessmentInterfaceType[] = [
  { key: 331, title: "Add Assessment", icon: <LuPlus /> },
  {
    key: 109,
    title: "Generate it",
    icon: <LuBrain />,
    styles: "bg-violet-700 hover:bg-violet-800",
  },
  {
    key: 231,
    title: "Start Self Defending",
    icon: <LuPlay />,
    styles: "bg-emerald-600 hover:bg-emerald-700",
  },
];

export const assessments = [
  {
    id: "specialID",
    material_id: "somematerialid",
    title: "What is first space law?",
    answer: "This is bla bla bla bla bla...",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: "specialID123",
    material_id: "somematerialid",
    title: "2 + 2",
    answer: "4",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: "specialID55123",
    material_id: "somematerialid",
    title: "Where is Santa Claus live?",
    answer: "Laplandia",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
  {
    id: "specialID13451",
    material_id: "somematerialid",
    title: "How to explain third Newton law?",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et obcaecati eaque deleniti ullam iusto maiores ad velit consectetur quas asperiores voluptas magni vero error, neque nam debitis dolore vitae explicabo odio ab fugiat nemo tenetur! Dolorum sint exercitationem ipsa maxime alias rem voluptatum tempora! Obcaecati sunt, repudiandae ratione adipisci aperiam et architecto blanditiis voluptatibus iure, pariatur dicta hic? Facere, eius debitis. Nam nesciunt itaque provident! Dolorum, reiciendis voluptatibus aliquid nam numquam cupiditate consequatur, tempora cumque provident dolorem repudiandae quo! Cum doloribus placeat eaque rerum quos impedit a! Exercitationem illum, blanditiis sapiente sint laboriosam voluptatem! Deleniti nesciunt tempore dolor optio quos!",
    created_at: Date.now(),
    updated_at: Date.now(),
  },
];
