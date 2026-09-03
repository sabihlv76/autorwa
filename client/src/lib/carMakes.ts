import {
  siAudi,
  siBmw,
  siChevrolet,
  siFord,
  siHonda,
  siHyundai,
  siKia,
  siMazda,
  siMitsubishi,
  siNissan,
  siPeugeot,
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
 * Curated quick-select list for the filter sidebar, scoped to brands common
 * in the East African used-car market that simple-icons actually has
 * (Mercedes-Benz, Isuzu, Land Rover, and Lexus aren't in its catalog).
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
];
