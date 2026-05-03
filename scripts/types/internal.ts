// NOTE: These types are "internal" to this app

export type Item = {
  amount: {
    ps: number;
    mooe: number;
    co: number;
  };
};
export type Program = {
  name: string;
  items: Item[];
};

export type Subcategory = {
  name: string;
  programs: Program[];
};

export type Unit = {
  name: string;
  subcategories: Subcategory[];
};

export type Sector = {
  name?: string;
  units: Unit[];
};

export type PageData = {
  sectors: Sector[];
};
