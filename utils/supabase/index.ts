export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      authors: {
        Row: {
          author: string | null
          created_at: string
          email: string | null
          id: number
          papers: number[] | null
        }
        Insert: {
          author?: string | null
          created_at?: string
          email?: string | null
          id?: number
          papers?: number[] | null
        }
        Update: {
          author?: string | null
          created_at?: string
          email?: string | null
          id?: number
          papers?: number[] | null
        }
        Relationships: []
      }
      GlobalBrain: {
        Row: {
          author1: string | null
          author2: string | null
          authors: string | null
          created_at: string
          id: number
          journal: string | null
          keyFindings: string | null
          link: string | null
          metaDescription: string | null
          onePageSummary: string | null
          organization: string | null
          pillar: Database["public"]["Enums"]["solutions"] | null
          solution: Database["public"]["Enums"]["solution"] | null
          subcategory: Database["public"]["Enums"]["subcategory"] | null
          subpillar: Database["public"]["Enums"]["subpillar"] | null
          tags: string[] | null
          title: string | null
          year: number | null
        }
        Insert: {
          author1?: string | null
          author2?: string | null
          authors?: string | null
          created_at?: string
          id?: number
          journal?: string | null
          keyFindings?: string | null
          link?: string | null
          metaDescription?: string | null
          onePageSummary?: string | null
          organization?: string | null
          pillar?: Database["public"]["Enums"]["solutions"] | null
          solution?: Database["public"]["Enums"]["solution"] | null
          subcategory?: Database["public"]["Enums"]["subcategory"] | null
          subpillar?: Database["public"]["Enums"]["subpillar"] | null
          tags?: string[] | null
          title?: string | null
          year?: number | null
        }
        Update: {
          author1?: string | null
          author2?: string | null
          authors?: string | null
          created_at?: string
          id?: number
          journal?: string | null
          keyFindings?: string | null
          link?: string | null
          metaDescription?: string | null
          onePageSummary?: string | null
          organization?: string | null
          pillar?: Database["public"]["Enums"]["solutions"] | null
          solution?: Database["public"]["Enums"]["solution"] | null
          subcategory?: Database["public"]["Enums"]["subcategory"] | null
          subpillar?: Database["public"]["Enums"]["subpillar"] | null
          tags?: string[] | null
          title?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      solution:
        | "Solar Photovoltaic"
        | "Solar Thermoelectric"
        | "Geothermal Power"
        | "Onshore Wind"
        | "Offshore Wind"
        | "Wave Energy"
        | "Sustainable Hydro"
        | "Sust. Biomass Power"
        | "Green H2 Power"
        | "Advanced Nuclear"
        | "Solar Heat"
        | "Geothermal Heat"
        | "Sust. Biomass Heat"
        | "Green H2 Heat"
        | "District Heat"
        | "Electric Heat"
        | "Green H2 Fuel"
        | "Sustainable Synfuel"
        | "Sustainable Biofuel"
        | "Electric Transport"
        | "Built Environment"
        | "Transportation"
        | "Transmission & Storage"
        | "Industries & Services"
        | "Protected Lands"
        | "Conserved Lands"
        | "Indigenous Tenure"
        | "Urban Biodiversity"
        | "Protected Seas"
        | "Marine Habitats"
        | "Sustainable Fisheries"
        | "Marine Carbon Sinks"
        | "Reforestation"
        | "Forest Recovery"
        | "Sustainable Forestry"
        | "Grassland Restoration"
        | "Wetlands Restoration"
        | "Mangrove Restoration"
        | "Coral/Shore Restoration"
        | "Species Rewilding"
        | "Land Corridors"
        | "Buffers & Greenways"
        | "Rivers & Streams"
        | "Marine Corridors"
        | "Farm Afforestation"
        | "Cropland Restoration"
        | "Soil Management"
        | "Sustainable Biochar"
        | "Sustainable Fertilizer"
        | "Natural Pest Control"
        | "Sustainable Rice Farming"
        | "Agritecture"
        | "Crop Optimization"
        | "Dryland Irrigation"
        | "Agroforestry"
        | "Polyculture"
        | "Perennial/Superfoods"
        | "Seed Diversity"
        | "Smallholder Farming"
        | "Silvopasture"
        | "Sustainable Grazing"
        | "Healthy Feed"
        | "Meat-free Proteins"
        | "Planetarian Diet"
        | "Storage & Logistics"
        | "Bioregional Sourcing"
        | "Food Upcycling"
        | "Urban Gardening"
        | "Composting"
        | "Meal Planning"
        | "Sustainable Fiber & Pulp"
        | "Green Textiles"
        | "Recycle & Reuse"
        | "Conventional Nuclear"
        | "Carbon Capture & Storage (CCS)"
        | "Bioenergy w/ Carbon Capture (BECCS)"
        | "Forest Biomass Energy"
        | "Solar Radiation Management (SRM)"
        | "Direct Air Capture (DAC)"
        | "Disease"
        | "Wildfires"
        | "Extreme Heat"
        | "Eco-anxiety"
        | "Food/Water Insecurity"
        | "Sea Level Rise"
        | "Flooding/Storms"
        | "Ocean Acidification"
        | "Melting Ice"
        | "Biodiversity Loss"
        | "Drought"
        | "Economic Risk"
        | "Conflict & Migration"
        | "Atmosphere"
        | "Hyrdrosphere - Freshwater"
        | "Hydrosphere - Oceans"
        | "Cryosphere"
        | "Lithosphere & Biosphere"
      solutions:
        | "Energy Transition"
        | "Nature Conservation"
        | "Regenerative Agriculture"
        | "Disputed Solutions"
        | "Climate Change"
        | "Biodiversity Loss"
        | "General"
      subcategory:
        | "Monocrystalline"
        | "Polycrystalline"
        | "Thin-film"
        | "Transparent"
        | "Solar tiles"
        | "Perovskite"
        | "Chemicals - Pharmaceutical"
        | "Chemicals - Agricultural"
        | "Chemicals - Inorganic"
        | "Chemicals - Fibers & Rubber"
        | "Petrochemicals/Plastics"
        | "Textiles & Leather"
        | "Metals/Minerals"
        | "Cement Production"
        | "Processing - Agriculture"
        | "Processing - Forestry"
        | "Processing - Fisheries"
        | "Water & Waste Utilities"
        | "Rarity Sites"
        | "Land Habitats"
        | "Mammal Assemblages"
        | "Intact Wilderness"
        | "Climate Refugia"
        | "Crops - General"
        | "Asparagus & Agave (Asparagaceae)"
        | "Apple, Stone Fruit & Berries (Rosaceae)"
        | "Avocado (Lauraceae)"
        | "Banana & Plantain"
        | "Barberry & Mayapple (Berberidaceae)"
        | "Bayberry (Myricaceae)"
        | "Beets & Spinach (Amaranthaceae)"
        | "Blueberries & Cranberries (Ericaceae)"
        | "Brassicas & Capers"
        | "Brazil nuts (Lecythidaceae)"
        | "Buckwheat (Polygonaceae)"
        | "Cactus (Cactaceae)"
        | "Carrot & Celery (Apiaceae)"
        | "Cassava & Rubber (Euphorbiaceae)"
        | "Chestnuts (Fagaceae)"
        | "Citrus (Rutaceae)"
        | "Coffee (Rubiaceae)"
        | "Cotton & Cacao (Malvaceae)"
        | "Currant (Grossulariaceae)"
        | "Fig & Jackfruit (Moraceae)"
        | "Flax/Linseed (Linaceae)"
        | "Ginger (Zingiberaceae)"
        | "Grains/Grasses (Poaceae incl. Sugar)"
        | "Grapes (Vitaceae)"
        | "Guava & Clove (Myrtaceae)"
        | "Hazelnuts (Betulaceae)"
        | "Hemp (Cannabaceae)"
        | "Honey & Pollen"
        | "Legumes (Fabaceae)"
        | "Lotus (Nelumbonaceae)"
        | "Macadamia nuts (Proteaceae)"
        | "Mangoes & Cashew (Anacardiaceae)"
        | "Mangosteen & Durian"
        | "Mashua & Nasturtium (Nelumbonaceae)"
        | "Mint, Sage & Basil (Lamiaceae)"
        | "Moringa (Moringaceae)"
        | "Mushrooms"
        | "Nightshades (Solanaceae incl. Tobacco)"
        | "Olives (Oleaceae)"
        | "Onions & Garlic (Amaryllidaceae)"
        | "Palm & Coconut (Araceceae)"
        | "Papaya (Caricaceae)"
        | "Passion Fruit (Passifloraceae)"
        | "Persimmon (Ebenanceae)"
        | "Pine nuts (Pinaceae)"
        | "Pineapple (Bromeliaceae)"
        | "Pomegranate (Lythraceae)"
        | "Poppy (Papaveraceae)"
        | "Purslane (Portulacaceae)"
        | "Seaweeds"
        | "Sesame (Pedaliaceae)"
        | "Soapberry (Sapindaceae)"
        | "Soursop & Nutmeg"
        | "Squash & Melons (Cucurbitaceae)"
        | "Sunflower & Lettuce (Asteraceae)"
        | "Taro (Araceae)"
        | "Tea (Theaceae)"
        | "Walnuts & Pecans (Juglandaceae)"
        | "Yams & Sweet Potatoes"
        | "Kiwi (Actinidiaceae)"
        | "Nettle (Urticaceae)"
      subpillar:
        | "Renewable Power"
        | "Renewable Heat"
        | "Renewable Transport"
        | "Energy Efficiency"
        | "Land Conservation"
        | "Ocean Conservation"
        | "Ecosystem Restoration"
        | "Wildlife Connectivity"
        | "Regenerative Croplands"
        | "Regenerative Rangelands"
        | "Food Waste Reduction"
        | "Circular Fibersheds"
        | "Controversial Solutions"
        | "Speculative Solutions"
        | "Climate Impacts"
        | "Planetary Systems"
        | "Anthropogenic Causes"
        | "Adaptation & Resilience"
        | "Strategic Planning"
        | "Accounting/MRV"
        | "Deforestation"
        | "Development"
        | "Mining"
        | "Pollution"
        | "Hunting/Poaching"
        | "Overfishing"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      solution: [
        "Solar Photovoltaic",
        "Solar Thermoelectric",
        "Geothermal Power",
        "Onshore Wind",
        "Offshore Wind",
        "Wave Energy",
        "Sustainable Hydro",
        "Sust. Biomass Power",
        "Green H2 Power",
        "Advanced Nuclear",
        "Solar Heat",
        "Geothermal Heat",
        "Sust. Biomass Heat",
        "Green H2 Heat",
        "District Heat",
        "Electric Heat",
        "Green H2 Fuel",
        "Sustainable Synfuel",
        "Sustainable Biofuel",
        "Electric Transport",
        "Built Environment",
        "Transportation",
        "Transmission & Storage",
        "Industries & Services",
        "Protected Lands",
        "Conserved Lands",
        "Indigenous Tenure",
        "Urban Biodiversity",
        "Protected Seas",
        "Marine Habitats",
        "Sustainable Fisheries",
        "Marine Carbon Sinks",
        "Reforestation",
        "Forest Recovery",
        "Sustainable Forestry",
        "Grassland Restoration",
        "Wetlands Restoration",
        "Mangrove Restoration",
        "Coral/Shore Restoration",
        "Species Rewilding",
        "Land Corridors",
        "Buffers & Greenways",
        "Rivers & Streams",
        "Marine Corridors",
        "Farm Afforestation",
        "Cropland Restoration",
        "Soil Management",
        "Sustainable Biochar",
        "Sustainable Fertilizer",
        "Natural Pest Control",
        "Sustainable Rice Farming",
        "Agritecture",
        "Crop Optimization",
        "Dryland Irrigation",
        "Agroforestry",
        "Polyculture",
        "Perennial/Superfoods",
        "Seed Diversity",
        "Smallholder Farming",
        "Silvopasture",
        "Sustainable Grazing",
        "Healthy Feed",
        "Meat-free Proteins",
        "Planetarian Diet",
        "Storage & Logistics",
        "Bioregional Sourcing",
        "Food Upcycling",
        "Urban Gardening",
        "Composting",
        "Meal Planning",
        "Sustainable Fiber & Pulp",
        "Green Textiles",
        "Recycle & Reuse",
        "Conventional Nuclear",
        "Carbon Capture & Storage (CCS)",
        "Bioenergy w/ Carbon Capture (BECCS)",
        "Forest Biomass Energy",
        "Solar Radiation Management (SRM)",
        "Direct Air Capture (DAC)",
        "Disease",
        "Wildfires",
        "Extreme Heat",
        "Eco-anxiety",
        "Food/Water Insecurity",
        "Sea Level Rise",
        "Flooding/Storms",
        "Ocean Acidification",
        "Melting Ice",
        "Biodiversity Loss",
        "Drought",
        "Economic Risk",
        "Conflict & Migration",
        "Atmosphere",
        "Hyrdrosphere - Freshwater",
        "Hydrosphere - Oceans",
        "Cryosphere",
        "Lithosphere & Biosphere",
      ],
      solutions: [
        "Energy Transition",
        "Nature Conservation",
        "Regenerative Agriculture",
        "Disputed Solutions",
        "Climate Change",
        "Biodiversity Loss",
        "General",
      ],
      subcategory: [
        "Monocrystalline",
        "Polycrystalline",
        "Thin-film",
        "Transparent",
        "Solar tiles",
        "Perovskite",
        "Chemicals - Pharmaceutical",
        "Chemicals - Agricultural",
        "Chemicals - Inorganic",
        "Chemicals - Fibers & Rubber",
        "Petrochemicals/Plastics",
        "Textiles & Leather",
        "Metals/Minerals",
        "Cement Production",
        "Processing - Agriculture",
        "Processing - Forestry",
        "Processing - Fisheries",
        "Water & Waste Utilities",
        "Rarity Sites",
        "Land Habitats",
        "Mammal Assemblages",
        "Intact Wilderness",
        "Climate Refugia",
        "Crops - General",
        "Asparagus & Agave (Asparagaceae)",
        "Apple, Stone Fruit & Berries (Rosaceae)",
        "Avocado (Lauraceae)",
        "Banana & Plantain",
        "Barberry & Mayapple (Berberidaceae)",
        "Bayberry (Myricaceae)",
        "Beets & Spinach (Amaranthaceae)",
        "Blueberries & Cranberries (Ericaceae)",
        "Brassicas & Capers",
        "Brazil nuts (Lecythidaceae)",
        "Buckwheat (Polygonaceae)",
        "Cactus (Cactaceae)",
        "Carrot & Celery (Apiaceae)",
        "Cassava & Rubber (Euphorbiaceae)",
        "Chestnuts (Fagaceae)",
        "Citrus (Rutaceae)",
        "Coffee (Rubiaceae)",
        "Cotton & Cacao (Malvaceae)",
        "Currant (Grossulariaceae)",
        "Fig & Jackfruit (Moraceae)",
        "Flax/Linseed (Linaceae)",
        "Ginger (Zingiberaceae)",
        "Grains/Grasses (Poaceae incl. Sugar)",
        "Grapes (Vitaceae)",
        "Guava & Clove (Myrtaceae)",
        "Hazelnuts (Betulaceae)",
        "Hemp (Cannabaceae)",
        "Honey & Pollen",
        "Legumes (Fabaceae)",
        "Lotus (Nelumbonaceae)",
        "Macadamia nuts (Proteaceae)",
        "Mangoes & Cashew (Anacardiaceae)",
        "Mangosteen & Durian",
        "Mashua & Nasturtium (Nelumbonaceae)",
        "Mint, Sage & Basil (Lamiaceae)",
        "Moringa (Moringaceae)",
        "Mushrooms",
        "Nightshades (Solanaceae incl. Tobacco)",
        "Olives (Oleaceae)",
        "Onions & Garlic (Amaryllidaceae)",
        "Palm & Coconut (Araceceae)",
        "Papaya (Caricaceae)",
        "Passion Fruit (Passifloraceae)",
        "Persimmon (Ebenanceae)",
        "Pine nuts (Pinaceae)",
        "Pineapple (Bromeliaceae)",
        "Pomegranate (Lythraceae)",
        "Poppy (Papaveraceae)",
        "Purslane (Portulacaceae)",
        "Seaweeds",
        "Sesame (Pedaliaceae)",
        "Soapberry (Sapindaceae)",
        "Soursop & Nutmeg",
        "Squash & Melons (Cucurbitaceae)",
        "Sunflower & Lettuce (Asteraceae)",
        "Taro (Araceae)",
        "Tea (Theaceae)",
        "Walnuts & Pecans (Juglandaceae)",
        "Yams & Sweet Potatoes",
        "Kiwi (Actinidiaceae)",
        "Nettle (Urticaceae)",
      ],
      subpillar: [
        "Renewable Power",
        "Renewable Heat",
        "Renewable Transport",
        "Energy Efficiency",
        "Land Conservation",
        "Ocean Conservation",
        "Ecosystem Restoration",
        "Wildlife Connectivity",
        "Regenerative Croplands",
        "Regenerative Rangelands",
        "Food Waste Reduction",
        "Circular Fibersheds",
        "Controversial Solutions",
        "Speculative Solutions",
        "Climate Impacts",
        "Planetary Systems",
        "Anthropogenic Causes",
        "Adaptation & Resilience",
        "Strategic Planning",
        "Accounting/MRV",
        "Deforestation",
        "Development",
        "Mining",
        "Pollution",
        "Hunting/Poaching",
        "Overfishing",
      ],
    },
  },
} as const
