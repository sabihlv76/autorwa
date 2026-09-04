import {
  siAudi,
  siBmw,
  siCadillac,
  siChevrolet,
  siFord,
  siHonda,
  siHyundai,
  siKia,
  siMazda,
  siMitsubishi,
  siNissan,
  siPeugeot,
  siPorsche,
  siRenault,
  siSubaru,
  siSuzuki,
  siToyota,
  siVolkswagen,
  type SimpleIcon,
} from "simple-icons";

export interface CarMake {
  name: string;
  icon: SimpleIcon;
}

/**
 * Curated quick-select list for the filter sidebar, scoped to brands
 * simple-icons actually has a logo for. Several brands common in the
 * East African / China-import used-car market aren't in its catalog at
 * all (Mercedes-Benz, Isuzu, Land Rover, Lexus, BYD, Buick, FAW, JMC,
 * Forthing) — those only appear in `ALL_CAR_MAKES` below, not here.
 * `make` itself stays free text — this is a shortcut, not a constraint.
 */
export const CAR_MAKES: CarMake[] = [
  { name: "Toyota", icon: siToyota },
  { name: "Honda", icon: siHonda },
  { name: "Nissan", icon: siNissan },
  { name: "Mazda", icon: siMazda },
  { name: "Mitsubishi", icon: siMitsubishi },
  { name: "Suzuki", icon: siSuzuki },
  { name: "Hyundai", icon: siHyundai },
  { name: "Kia", icon: siKia },
  { name: "Subaru", icon: siSubaru },
  { name: "Volkswagen", icon: siVolkswagen },
  { name: "BMW", icon: siBmw },
  { name: "Ford", icon: siFord },
  { name: "Peugeot", icon: siPeugeot },
  { name: "Audi", icon: siAudi },
  { name: "Chevrolet", icon: siChevrolet },
  { name: "Renault", icon: siRenault },
  { name: "Cadillac", icon: siCadillac },
  { name: "Porsche", icon: siPorsche },
];

/**
 * Full maintained list of makes (icon-backed ones above plus brands with
 * no simple-icons logo), used for the admin product form's Make dropdown
 * where an icon isn't needed — just a controlled, sorted vocabulary.
 */
export const ALL_CAR_MAKES: string[] = [
  ...CAR_MAKES.map((make) => make.name),
  "Mercedes-Benz",
  "Isuzu",
  "Land Rover",
  "Lexus",
  "BYD",
  "Buick",
  "FAW",
  "JMC",
  "Forthing",
].sort((a, b) => a.localeCompare(b));
