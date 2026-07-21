"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./lib/supabase";
type Product = {
  id?: string;
  code: string;
  name: string;
  image?: string;
  home: number;
  china: number;
  wbTransit: number;
  wbWarehouse: number;
  kaspi: number;
  cost: number;
  profit: number;
};

type ProductRow = {
  id: string;
  code: string;
  name: string;
  image: string | null;
  home: number;
  china: number;
  wb_transit: number;
  wb_warehouse: number;
  kaspi_transit: number;
  cost: number;
  profit: number;
};

type OperationRow = {
  id: string;
  created_at: string;
  product_code: string;
  product_name: string;
  operation: ProductOperation;
  quantity: number;
  profit: number;
};

type Section =
  | "dashboard"
  | "products"
  | "new-product"
  | "china"
  | "wb"
  | "kaspi"
  | "profit"
  | "settings";

type ProductOperation =
  | "home-to-kaspi"
  | "kaspi-sold"
  | "home-to-wb"
  | "wb-received"
  | "wb-sold"
  | "china-received";

type OperationRecord = {
  id: string;
  createdAt: string;
  date: string;
  code: string;
  name: string;
  operation: ProductOperation;
  quantity: number;
  profit: number;
};

const initialProducts: Product[] = [
  {
    code: "D-001",
    name: "Замок",
    home: 20,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 12500,
    profit: 0,
  },
  {
    code: "D-002",
    name: "Раскладушка PRO",
    home: 3,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 30000,
    profit: -29900,
  },
  {
    code: "D-003",
    name: "JRL машинка",
    home: 61,
    china: 0,
    wbTransit: 16,
    wbWarehouse: 0,
    kaspi: 1,
    cost: 29500,
    profit: 719100,
  },
  {
    code: "D-004",
    name: "Jump Starter",
    home: 31,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 4,
    kaspi: 1,
    cost: 17400,
    profit: 261780,
  },
  {
    code: "D-005",
    name: "NexTool",
    home: 2,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-006",
    name: "Первая помощь",
    home: 0,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 27700,
  },
  {
    code: "D-007",
    name: "Стулья",
    home: 2,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-008",
    name: "Кресло-качалка (ақ)",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 44500,
    profit: 38000,
  },
  {
    code: "D-009",
    name: "Раскладушка ACO2",
    home: 0,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 21000,
  },
  {
    code: "D-010",
    name: "Кресло кожа",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-011",
    name: "Матрас",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-012",
    name: "Раскладной стул-шезлонг",
    home: 12,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-013",
    name: "Брызговик",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 2820,
    profit: 3000,
  },
  {
    code: "D-014",
    name: "Haier аэрогриль",
    home: 2,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 0,
  },
  {
    code: "D-015",
    name: "Раскладушка без матраса",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 1,
    cost: 13700,
    profit: 10900,
  },
  {
    code: "D-016",
    name: "Раскладушка матраспен",
    home: 4,
    china: 4,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 21000,
    profit: 28800,
  },
  {
    code: "D-017",
    name: "PROPLAST Relax Rocking",
    home: 3,
    china: 0,
    wbTransit: 1,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 27000,
    profit: 40000,
  },
  {
    code: "D-018",
    name: "Гантель 50 кг",
    home: 0,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 307500,
  },
  {
    code: "D-019",
    name: "Столик",
    home: 1,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 0,
    profit: 26000,
  },
  {
    code: "D-020",
    name: "PROPLAST LUXE орындық (ақ)",
    home: 8,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 9700,
    profit: 0,
  },
  {
    code: "D-021",
    name: "Безкаркасный кресло",
    home: 0,
    china: 0,
    wbTransit: 0,
    wbWarehouse: 0,
    kaspi: 0,
    cost: 30000,
    profit: 35000,
  },
];

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    image: row.image ?? "",
    home: row.home ?? 0,
    china: row.china ?? 0,
    wbTransit: row.wb_transit ?? 0,
    wbWarehouse: row.wb_warehouse ?? 0,
    kaspi: row.kaspi_transit ?? 0,
    cost: row.cost ?? 0,
    profit: row.profit ?? 0,
  };
}

function productToRow(product: Product) {
  return {
    code: product.code,
    name: product.name,
    image: product.image || null,
    home: product.home,
    china: product.china,
    wb_transit: product.wbTransit,
    wb_warehouse: product.wbWarehouse,
    kaspi_transit: product.kaspi,
    cost: product.cost,
    profit: product.profit,
    updated_at: new Date().toISOString(),
  };
}

function operationRowToRecord(row: OperationRow): OperationRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    date: new Date(row.created_at).toLocaleString("ru-RU"),
    code: row.product_code,
    name: row.product_name,
    operation: row.operation,
    quantity: row.quantity,
    profit: row.profit,
  };
}

const menuItems: { id: Section; label: string }[] = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "products", label: "📦 Тауарлар" },
  { id: "new-product", label: "➕ Жаңа тауар" },
  { id: "china", label: "🚛 Қытай → Үй" },
  { id: "wb", label: "🟣 Wildberries" },
  { id: "kaspi", label: "🟠 Kaspi" },
  { id: "profit", label: "📈 Пайда" },
  { id: "settings", label: "⚙️ Баптаулар" },
];

const money = {
  format(value: number) {
    return String(Math.trunc(value)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  },
};

const PROFIT_ADJUSTMENT = 15900; // Бұрынғы реестрдегі, бірақ нақты D-кодқа бөлінбеген пайда
const CURRENT_MONTH_BASE_PROFIT = 758780; // 22.07.2026 дейінгі шілде пайдасы
const CURRENT_MONTH_BASE_YEAR = 2026;
const CURRENT_MONTH_BASE_MONTH = 6; // JavaScript: 0 = қаңтар, 6 = шілде
const APP_VERSION = "ДАМУ ERP v5 • 22.07.2026";

export default function Home() {
  const [section, setSection] = useState<Section>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [operationProduct, setOperationProduct] = useState<Product | null>(
    null,
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [history, setHistory] = useState<OperationRecord[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error("Сессияны тексеру қатесі:", error);
        setUserEmail(null);
        setAuthLoading(false);
        return;
      }

      const email = data.session?.user.email ?? null;
      setUserEmail(email);
      setAuthLoading(false);

      if (email) {
        await loadCloudData();
      }
    }

    void checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;

        const email = session?.user.email ?? null;
        setUserEmail(email);
        setAuthLoading(false);

        if (event === "SIGNED_IN" && email) {
          void loadCloudData();
        }

        if (event === "SIGNED_OUT") {
          setProducts([]);
          setHistory([]);
          setLoading(false);
          setSection("dashboard");
        }
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function loadCloudData() {
    console.log("loadCloudData іске қосылды");
    setLoading(true);

    const [productsResult, historyResult] = await Promise.all([
      supabase.from("products").select("*").order("code"),
      supabase
        .from("operations")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (productsResult.error) {
      alert(`Тауарларды жүктеу қатесі: ${productsResult.error.message}`);
      setLoading(false);
      return;
    }

    let cloudProducts = (productsResult.data ?? []).map((row) =>
      rowToProduct(row as ProductRow),
    );

    if (cloudProducts.length === 0) {
      const { data, error } = await supabase
        .from("products")
        .insert(initialProducts.map(productToRow))
        .select("*")
        .order("code");

      if (error) {
        alert(`Бастапқы тауарларды көшіру қатесі: ${error.message}`);
        setLoading(false);
        return;
      }

      cloudProducts = (data ?? []).map((row) =>
        rowToProduct(row as ProductRow),
      );
    }

    setProducts(cloudProducts);

    if (historyResult.error) {
      console.error("Операциялар тарихын жүктеу қатесі:", historyResult.error);
      setHistory([]);
    } else {
      setHistory(
        (historyResult.data ?? []).map((row) =>
          operationRowToRecord(row as OperationRow),
        ),
      );
    }

    setLoading(false);
  }

  const totals = useMemo(() => {
    return products.reduce(
      (acc, product) => {
        acc.home += product.home;
        acc.marketplaceTransit += product.wbTransit + product.kaspi;
        acc.chinaTransit += product.china;
        acc.wbWarehouse += product.wbWarehouse;
        acc.profit += product.profit;
        return acc;
      },
      {
        home: 0,
        marketplaceTransit: 0,
        chinaTransit: 0,
        wbWarehouse: 0,
        profit: PROFIT_ADJUSTMENT,
      },
    );
  }, [products]);

  const currentMonthOperationsProfit = useMemo(() => {
    const now = new Date();
    const trackingStart = new Date(2026, 6, 22, 0, 0, 0, 0).getTime();

    return history.reduce((sum, item) => {
      const date = new Date(item.createdAt);
      const isCurrentMonth =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth();

      if (!isCurrentMonth || item.profit === 0) return sum;

      const isBaseMonth =
        now.getFullYear() === CURRENT_MONTH_BASE_YEAR &&
        now.getMonth() === CURRENT_MONTH_BASE_MONTH;

      // 22.07.2026 дейінгі пайда 758 780 ₸ бастапқы сомаға кіріп қойған.
      // Сондықтан сол айда тек ERP іске қосылғаннан кейінгі операциялар қосылады.
      if (isBaseMonth && date.getTime() < trackingStart) return sum;

      return sum + item.profit;
    }, 0);
  }, [history]);

  const currentMonthProfit = useMemo(() => {
    const now = new Date();
    const isBaseMonth =
      now.getFullYear() === CURRENT_MONTH_BASE_YEAR &&
      now.getMonth() === CURRENT_MONTH_BASE_MONTH;

    return (
      (isBaseMonth ? CURRENT_MONTH_BASE_PROFIT : 0) +
      currentMonthOperationsProfit
    );
  }, [currentMonthOperationsProfit]);

  async function addProduct(product: Product): Promise<boolean> {
    const exists = products.some(
      (item) => item.code.toLowerCase() === product.code.toLowerCase(),
    );

    if (exists) {
      alert("Бұл кодпен тауар бұрыннан бар.");
      return false;
    }

    const { data, error } = await supabase
      .from("products")
      .insert(productToRow(product))
      .select("*")
      .single();

    if (error) {
      alert(`Тауарды сақтау қатесі: ${error.message}`);
      return false;
    }

    setProducts((current) =>
      [...current, rowToProduct(data as ProductRow)].sort((a, b) =>
        a.code.localeCompare(b.code),
      ),
    );
    setSection("products");
    return true;
  }

  async function updateProduct(updated: Product) {
    const { data, error } = await supabase
      .from("products")
      .update(productToRow(updated))
      .eq(updated.id ? "id" : "code", updated.id ?? updated.code)
      .select("*")
      .single();

    if (error) {
      alert(`Өзгерісті сақтау қатесі: ${error.message}`);
      return;
    }

    const saved = rowToProduct(data as ProductRow);
    setProducts((current) =>
      current.map((item) => (item.code === saved.code ? saved : item)),
    );
    setEditingProduct(null);
  }

  async function applyOperation({
    code,
    operation,
    quantity,
    profit,
  }: {
    code: string;
    operation: ProductOperation;
    quantity: number;
    profit: number;
  }) {
    const currentProduct = products.find((item) => item.code === code);
    if (!currentProduct) {
      alert("Тауар табылмады.");
      return false;
    }

    const updated = { ...currentProduct };
    let errorMessage = "";

    if (operation === "home-to-kaspi") {
      if (updated.home < quantity)
        errorMessage = "Үйдегі тауар саны жеткіліксіз.";
      else {
        updated.home -= quantity;
        updated.kaspi += quantity;
      }
    }
    if (operation === "kaspi-sold") {
      if (updated.kaspi < quantity)
        errorMessage = "Kaspi жолындағы тауар саны жеткіліксіз.";
      else {
        updated.kaspi -= quantity;
        updated.profit += profit;
      }
    }
    if (operation === "home-to-wb") {
      if (updated.home < quantity)
        errorMessage = "Үйдегі тауар саны жеткіліксіз.";
      else {
        updated.home -= quantity;
        updated.wbTransit += quantity;
      }
    }
    if (operation === "wb-received") {
      if (updated.wbTransit < quantity)
        errorMessage = "WB жолындағы тауар саны жеткіліксіз.";
      else {
        updated.wbTransit -= quantity;
        updated.wbWarehouse += quantity;
      }
    }
    if (operation === "wb-sold") {
      if (updated.wbWarehouse < quantity)
        errorMessage = "WB қоймасындағы тауар саны жеткіліксіз.";
      else {
        updated.wbWarehouse -= quantity;
        updated.profit += profit;
      }
    }
    if (operation === "china-received") {
      if (updated.china < quantity)
        errorMessage = "Қытайдан келе жатқан тауар саны жеткіліксіз.";
      else {
        updated.china -= quantity;
        updated.home += quantity;
      }
    }

    if (errorMessage) {
      alert(errorMessage);
      return false;
    }

    const { data: savedProduct, error: productError } = await supabase
      .from("products")
      .update(productToRow(updated))
      .eq(updated.id ? "id" : "code", updated.id ?? updated.code)
      .select("*")
      .single();

    if (productError) {
      alert(`Операцияны сақтау қатесі: ${productError.message}`);
      return false;
    }

    const { data: savedOperation, error: operationError } = await supabase
      .from("operations")
      .insert({
        product_code: updated.code,
        product_name: updated.name,
        operation,
        quantity,
        profit,
      })
      .select("*")
      .single();

    if (operationError) {
      alert(
        `Тауар саны сақталды, бірақ тарих жазылмады: ${operationError.message}`,
      );
    }

    const normalized = rowToProduct(savedProduct as ProductRow);
    setProducts((current) =>
      current.map((item) =>
        item.code === normalized.code ? normalized : item,
      ),
    );

    if (savedOperation) {
      setHistory((current) => [
        operationRowToRecord(savedOperation as OperationRow),
        ...current,
      ]);
    }

    setOperationProduct(null);
    return true;
  }

  async function undoOperation(item: OperationRecord) {
    const confirmed = window.confirm(
      `${item.code} — ${item.quantity} дана операциясын болдырмауға сенімдісіз бе?`,
    );
    if (!confirmed) return;

    const currentProduct = products.find(
      (product) => product.code === item.code,
    );
    if (!currentProduct) {
      alert("Бұл операцияға қатысты тауар табылмады.");
      return;
    }

    const restored = { ...currentProduct };
    let errorMessage = "";

    if (item.operation === "home-to-kaspi") {
      if (restored.kaspi < item.quantity)
        errorMessage = "Kaspi жолында қайтаруға жеткілікті тауар жоқ.";
      else {
        restored.kaspi -= item.quantity;
        restored.home += item.quantity;
      }
    }
    if (item.operation === "kaspi-sold") {
      restored.kaspi += item.quantity;
      restored.profit -= item.profit;
    }
    if (item.operation === "home-to-wb") {
      if (restored.wbTransit < item.quantity)
        errorMessage = "WB жолында қайтаруға жеткілікті тауар жоқ.";
      else {
        restored.wbTransit -= item.quantity;
        restored.home += item.quantity;
      }
    }
    if (item.operation === "wb-received") {
      if (restored.wbWarehouse < item.quantity)
        errorMessage = "WB қоймасында қайтаруға жеткілікті тауар жоқ.";
      else {
        restored.wbWarehouse -= item.quantity;
        restored.wbTransit += item.quantity;
      }
    }
    if (item.operation === "wb-sold") {
      restored.wbWarehouse += item.quantity;
      restored.profit -= item.profit;
    }
    if (item.operation === "china-received") {
      if (restored.home < item.quantity)
        errorMessage = "Үйде Қытай жолына қайтаруға жеткілікті тауар жоқ.";
      else {
        restored.home -= item.quantity;
        restored.china += item.quantity;
      }
    }

    if (errorMessage) {
      alert(
        errorMessage +
          " Алдымен одан кейін жасалған операцияларды кері қайтарыңыз.",
      );
      return;
    }

    const { data: savedProduct, error: productError } = await supabase
      .from("products")
      .update(productToRow(restored))
      .eq(restored.id ? "id" : "code", restored.id ?? restored.code)
      .select("*")
      .single();

    if (productError) {
      alert(`Операцияны болдырмау қатесі: ${productError.message}`);
      return;
    }

    const { error: deleteError } = await supabase
      .from("operations")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      await supabase
        .from("products")
        .update(productToRow(currentProduct))
        .eq(
          currentProduct.id ? "id" : "code",
          currentProduct.id ?? currentProduct.code,
        );
      alert(`Тарих жазбасын өшіру қатесі: ${deleteError.message}`);
      return;
    }

    const normalized = rowToProduct(savedProduct as ProductRow);
    setProducts((current) =>
      current.map((product) =>
        product.code === normalized.code ? normalized : product,
      ),
    );
    setHistory((current) =>
      current.filter((operation) => operation.id !== item.id),
    );
    alert("Операция сәтті қайтарылды. Қалдық пен пайда жаңартылды.");
  }

  async function deleteProduct(code: string) {
    const confirmed = window.confirm(`${code} тауарын өшіруге сенімдісіз бе?`);
    if (!confirmed) return;

    const { error } = await supabase.from("products").delete().eq("code", code);
    if (error) {
      alert(`Тауарды өшіру қатесі: ${error.message}`);
      return;
    }
    setProducts((current) => current.filter((item) => item.code !== code));
  }

  async function clearHistory() {
    const { error } = await supabase
      .from("operations")
      .delete()
      .not("id", "is", null);
    if (error) {
      alert(`Тарихты тазалау қатесі: ${error.message}`);
      return;
    }
    setHistory([]);
  }

  async function resetProducts() {
    const confirmed = window.confirm(
      "Бұлттағы барлық тауарды бастапқы базаға қайтаруға сенімдісіз бе?",
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .not("id", "is", null);
    if (deleteError) {
      alert(`Базаны тазалау қатесі: ${deleteError.message}`);
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert(initialProducts.map(productToRow))
      .select("*")
      .order("code");

    if (error) {
      alert(`Бастапқы базаны жазу қатесі: ${error.message}`);
      return;
    }

    setProducts((data ?? []).map((row) => rowToProduct(row as ProductRow)));
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Жүйеден шығу қатесі: ${error.message}`);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-lg font-bold">Сессия тексеріліп жатыр...</p>
          <p className="mt-2 text-sm text-slate-500">
            ДАМУ қауіпсіз кіру жүйесі
          </p>
        </div>
      </main>
    );
  }

  if (!userEmail) {
    return <LoginScreen />;
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-lg font-bold">ДАМУ жүктеліп жатыр...</p>
          <p className="mt-2 text-sm text-slate-500">Supabase бұлттық базасы</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 bg-slate-950 p-5 text-white">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">ДАМУ</h1>
            <p className="mt-1 text-sm text-slate-400">Бизнес басқару жүйесі</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  section === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-8">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                {menuItems.find((item) => item.id === section)?.label}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                ДАМУ жүйесінің жұмыс бөлімі
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-700 md:hidden">
                {APP_VERSION}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 md:inline-flex">
                {APP_VERSION}
              </span>
              <div className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">
                {userEmail}
              </div>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Шығу
              </button>
            </div>
          </header>

          {section === "dashboard" && (
            <Dashboard
              products={products}
              totals={totals}
              currentMonthProfit={currentMonthProfit}
              currentMonthOperationsProfit={currentMonthOperationsProfit}
            />
          )}

          {section === "products" && (
            <Products
              products={products}
              onNew={() => setSection("new-product")}
              onEdit={setEditingProduct}
              onDelete={deleteProduct}
              onPreview={setPreviewImage}
              onOperation={setOperationProduct}
            />
          )}

          {section === "new-product" && <NewProduct onAdd={addProduct} />}
          {section === "china" && (
            <EmptyCard
              title="Қытай → Үй"
              text="Қытайдан келе жатқан тауарлар осы жерде көрсетіледі."
            />
          )}
          {section === "wb" && (
            <EmptyCard
              title="Wildberries"
              text="WB жолдағы және қоймадағы тауарлар осы бөлімде болады."
            />
          )}
          {section === "kaspi" && (
            <EmptyCard
              title="Kaspi"
              text="Kaspi тапсырыстары мен жолдағы тауарлар осы жерде көрсетіледі."
            />
          )}
          {section === "profit" && (
            <Profit
              products={products}
              totalProfit={totals.profit}
              currentMonthProfit={currentMonthProfit}
              currentMonthOperationsProfit={currentMonthOperationsProfit}
              history={history}
              onClearHistory={clearHistory}
              onUndoOperation={undoOperation}
            />
          )}
          {section === "settings" && <Settings onReset={resetProducts} />}
        </section>
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={updateProduct}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {operationProduct && (
        <OperationModal
          product={operationProduct}
          onApply={applyOperation}
          onClose={() => setOperationProduct(null)}
        />
      )}

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </main>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setMessage("Email мен парольді толтырыңыз.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    setSubmitting(false);

    if (error) {
      setMessage("Email немесе пароль қате.");
      return;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-950">ДАМУ</h1>
          <p className="mt-2 text-sm text-slate-500">
            Бизнес басқару жүйесіне кіру
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="admin@damu.kz"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Пароль</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Пароль"
            />
          </label>

          {message && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Кіру орындалып жатыр..." : "Кіру"}
          </button>
        </div>
      </form>
    </main>
  );
}

function Dashboard({
  products,
  totals,
  currentMonthProfit,
  currentMonthOperationsProfit,
}: {
  products: Product[];
  currentMonthProfit: number;
  currentMonthOperationsProfit: number;
  totals: {
    home: number;
    marketplaceTransit: number;
    chinaTransit: number;
    wbWarehouse: number;
    profit: number;
  };
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Жалпы пайда"
          value={`${money.format(totals.profit)} ₸`}
          note="Барлық тауар бойынша"
        />
        <StatCard
          title={`${new Date().toLocaleDateString("kk-KZ", { month: "long" })} пайдасы`}
          value={`${money.format(currentMonthProfit)} ₸`}
          note={`Жаңа операциялар: ${currentMonthOperationsProfit >= 0 ? "+" : ""}${money.format(currentMonthOperationsProfit)} ₸`}
        />
        <StatCard
          title="Үйдегі тауар"
          value={`${totals.home} дана`}
          note="Белсенді қалдық"
        />
        <StatCard
          title="WB + Kaspi жолда"
          value={`${totals.marketplaceTransit} дана`}
          note="Клиентке және WB-ға бара жатыр"
        />
        <StatCard
          title="Қытайдан келе жатыр"
          value={`${totals.chinaTransit} дана`}
          note="Қытай → Үй"
        />
        <StatCard
          title="WB қоймада"
          value={`${totals.wbWarehouse} дана`}
          note="Wildberries қоймасындағы қалдық"
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-bold">Негізгі тауарлар</h3>
          <p className="text-sm text-slate-500">Қоймадағы соңғы мәліметтер</p>
        </div>
        <ProductTable products={products.slice(0, 6)} />
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Жалпы пайдаға бұрынғы реестрден <strong>15 900 ₸</strong> түзету
        қосылды. Бұл сома нақты D-кодқа бөлінген кезде түзету автоматты түрде
        алынып тасталады.
      </div>
    </>
  );
}

function Products({
  products,
  onNew,
  onEdit,
  onDelete,
  onPreview,
  onOperation,
}: {
  products: Product[];
  onNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (code: string) => void;
  onPreview: (image: string) => void;
  onOperation: (product: Product) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Барлық тауарлар</h3>
          <p className="text-sm text-slate-500">
            D-кодтар бойынша қойма тізімі
          </p>
        </div>

        <button
          onClick={onNew}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Жаңа тауар
        </button>
      </div>

      <ProductTable
        products={products}
        onEdit={onEdit}
        onDelete={onDelete}
        onPreview={onPreview}
        onOperation={onOperation}
      />
    </div>
  );
}

function ProductTable({
  products,
  onEdit,
  onDelete,
  onPreview,
  onOperation,
}: {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (code: string) => void;
  onPreview?: (image: string) => void;
  onOperation?: (product: Product) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1150px] text-left text-sm">
        <thead>
          <tr className="border-b text-slate-500">
            <th className="px-3 py-3">Сурет</th>
            <th className="px-3 py-3">Код</th>
            <th className="px-3 py-3">Тауар атауы</th>
            <th className="px-3 py-3">🏠 Үйде</th>
            <th className="px-3 py-3">🚛 Қытай</th>
            <th className="px-3 py-3">🟣 WB жолда</th>
            <th className="px-3 py-3">🏢 WB қойма</th>
            <th className="px-3 py-3">🟠 Kaspi</th>
            <th className="px-3 py-3">Өзіндік құн</th>
            <th className="px-3 py-3">Пайда</th>
            {(onEdit || onDelete || onOperation) && (
              <th className="px-3 py-3">Әрекет</th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.code}
              className="border-b last:border-0 hover:bg-slate-50"
            >
              <td className="px-3 py-4">
                {product.image ? (
                  <button
                    type="button"
                    onClick={() => onPreview?.(product.image!)}
                    className="block"
                    title="Үлкейтіп көру"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg border border-slate-200 object-cover hover:opacity-80"
                    />
                  </button>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                    Фото жоқ
                  </div>
                )}
              </td>
              <td className="px-3 py-4 font-bold text-blue-600">
                {product.code}
              </td>
              <td className="px-3 py-4 font-medium">{product.name}</td>
              <td className="px-3 py-4">{product.home}</td>
              <td className="px-3 py-4">{product.china}</td>
              <td className="px-3 py-4">{product.wbTransit}</td>
              <td className="px-3 py-4">{product.wbWarehouse}</td>
              <td className="px-3 py-4">{product.kaspi}</td>
              <td className="px-3 py-4">
                {product.cost ? `${money.format(product.cost)} ₸` : "—"}
              </td>
              <td className="px-3 py-4 font-semibold">
                {money.format(product.profit)} ₸
              </td>
              {(onEdit || onDelete || onOperation) && (
                <td className="px-3 py-4">
                  <div className="flex flex-wrap gap-2">
                    {onOperation && (
                      <button
                        onClick={() => onOperation(product)}
                        className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                      >
                        Операция
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(product)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                      >
                        Өңдеу
                      </button>
                    )}

                    {onDelete && (
                      <button
                        onClick={() => onDelete(product.code)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Өшіру
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NewProduct({
  onAdd,
}: {
  onAdd: (product: Product) => Promise<boolean>;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [home, setHome] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();
    const numericCost = Number(cost);
    const numericHome = Number(home);

    if (!cleanCode || !cleanName) {
      setMessage("Код пен тауар атауын толтырыңыз.");
      return;
    }

    if (
      Number.isNaN(numericCost) ||
      Number.isNaN(numericHome) ||
      numericCost < 0 ||
      numericHome < 0
    ) {
      setMessage("Баға мен сан дұрыс енгізілуі керек.");
      return;
    }

    const added = await onAdd({
      code: cleanCode,
      name: cleanName,
      image,
      home: numericHome,
      china: 0,
      wbTransit: 0,
      wbWarehouse: 0,
      kaspi: 0,
      cost: numericCost,
      profit: 0,
    });

    if (added) {
      setCode("");
      setName("");
      setCost("");
      setHome("");
      setImage("");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm"
    >
      <h3 className="text-xl font-bold">Жаңа тауар қосу</h3>
      <p className="mt-1 text-sm text-slate-500">
        Сақталған тауар «Тауарлар» бөліміне бірден қосылады.
      </p>

      <div className="mt-6 grid gap-4">
        <Input
          label="Тауар коды"
          placeholder="D-022"
          value={code}
          onChange={setCode}
        />
        <Input
          label="Тауар атауы"
          placeholder="Тауар атауы"
          value={name}
          onChange={setName}
        />
        <ImageUploader image={image} onChange={setImage} />
        <Input
          label="Өзіндік құны"
          placeholder="0"
          value={cost}
          onChange={setCost}
          type="number"
        />
        <Input
          label="Үйдегі саны"
          placeholder="0"
          value={home}
          onChange={setHome}
          type="number"
        />

        {message && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Сақтау
        </button>
      </div>
    </form>
  );
}

function EditProductModal({
  product,
  onSave,
  onClose,
}: {
  product: Product;
  onSave: (product: Product) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [image, setImage] = useState(product.image ?? "");
  const [home, setHome] = useState(String(product.home));
  const [china, setChina] = useState(String(product.china));
  const [wbTransit, setWbTransit] = useState(String(product.wbTransit));
  const [wbWarehouse, setWbWarehouse] = useState(String(product.wbWarehouse));
  const [kaspi, setKaspi] = useState(String(product.kaspi));
  const [cost, setCost] = useState(String(product.cost));
  const [profit, setProfit] = useState(String(product.profit));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const values = {
      home: Number(home),
      china: Number(china),
      wbTransit: Number(wbTransit),
      wbWarehouse: Number(wbWarehouse),
      kaspi: Number(kaspi),
      cost: Number(cost),
      profit: Number(profit),
    };

    if (
      !name.trim() ||
      Object.values(values).some((value) => Number.isNaN(value) || value < 0)
    ) {
      alert("Барлық мәнді дұрыс толтырыңыз.");
      return;
    }

    await onSave({
      ...product,
      name: name.trim(),
      image,
      ...values,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Тауарды өңдеу</h3>
            <p className="mt-1 text-sm text-slate-500">{product.code}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            Жабу
          </button>
        </div>

        <div className="mb-4">
          <ImageUploader image={image} onChange={setImage} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Тауар атауы"
            placeholder=""
            value={name}
            onChange={setName}
          />
          <Input
            label="Өзіндік құны"
            placeholder="0"
            value={cost}
            onChange={setCost}
            type="number"
          />
          <Input
            label="🏠 Үйде"
            placeholder="0"
            value={home}
            onChange={setHome}
            type="number"
          />
          <Input
            label="🚛 Қытай → Үй"
            placeholder="0"
            value={china}
            onChange={setChina}
            type="number"
          />
          <Input
            label="🟣 WB жолда"
            placeholder="0"
            value={wbTransit}
            onChange={setWbTransit}
            type="number"
          />
          <Input
            label="🏢 WB қойма"
            placeholder="0"
            value={wbWarehouse}
            onChange={setWbWarehouse}
            type="number"
          />
          <Input
            label="🟠 Kaspi жолда"
            placeholder="0"
            value={kaspi}
            onChange={setKaspi}
            type="number"
          />
          <Input
            label="Жиналған пайда"
            placeholder="0"
            value={profit}
            onChange={setProfit}
            type="number"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
          >
            Болдырмау
          </button>
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Өзгерісті сақтау
          </button>
        </div>
      </form>
    </div>
  );
}

function OperationModal({
  product,
  onApply,
  onClose,
}: {
  product: Product;
  onApply: (payload: {
    code: string;
    operation: ProductOperation;
    quantity: number;
    profit: number;
  }) => Promise<boolean>;
  onClose: () => void;
}) {
  const [operation, setOperation] = useState<ProductOperation>("home-to-kaspi");
  const [quantity, setQuantity] = useState("1");
  const [profit, setProfit] = useState("0");

  const needsProfit = operation === "kaspi-sold" || operation === "wb-sold";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericQuantity = Number(quantity);
    const numericProfit = Number(profit);

    if (
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0 ||
      Number.isNaN(numericProfit) ||
      numericProfit < 0
    ) {
      alert("Саны мен пайданы дұрыс енгізіңіз.");
      return;
    }

    await onApply({
      code: product.code,
      operation,
      quantity: numericQuantity,
      profit: needsProfit ? numericProfit : 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Тауар операциясы</h3>
            <p className="mt-1 text-sm text-slate-500">
              {product.code} — {product.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold hover:bg-slate-200"
          >
            Жабу
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 p-3">
            🏠 Үйде: {product.home}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            🚛 Қытай: {product.china}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            🟣 WB жолда: {product.wbTransit}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            🏢 WB қойма: {product.wbWarehouse}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            🟠 Kaspi: {product.kaspi}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            💰 Пайда: {money.format(product.profit)} ₸
          </div>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Операция түрі</span>
          <select
            value={operation}
            onChange={(event) =>
              setOperation(event.target.value as ProductOperation)
            }
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="home-to-kaspi">Үйден Kaspi жолына жіберу</option>
            <option value="kaspi-sold">Kaspi сатылды</option>
            <option value="home-to-wb">Үйден WB жолына жіберу</option>
            <option value="wb-received">WB қоймасына қабылданды</option>
            <option value="wb-sold">WB сатылды</option>
            <option value="china-received">Қытайдан үйге келді</option>
          </select>
        </label>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            label="Саны"
            placeholder="1"
            value={quantity}
            onChange={setQuantity}
            type="number"
          />

          {needsProfit && (
            <Input
              label="Осы сатудан түскен таза пайда"
              placeholder="0"
              value={profit}
              onChange={setProfit}
              type="number"
            />
          )}
        </div>

        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
          Жіберу операциясында тауар үйдегі саннан бірден азаяды. Сату кезінде
          тауар тиісті жолдан немесе қоймадан азайып, пайдаға қосылады.
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold"
          >
            Болдырмау
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Операцияны орындау
          </button>
        </div>
      </form>
    </div>
  );
}

function Profit({
  products,
  totalProfit,
  currentMonthProfit,
  currentMonthOperationsProfit,
  history,
  onClearHistory,
  onUndoOperation,
}: {
  products: Product[];
  totalProfit: number;
  currentMonthProfit: number;
  currentMonthOperationsProfit: number;
  history: OperationRecord[];
  onClearHistory: () => void;
  onUndoOperation: (item: OperationRecord) => Promise<void>;
}) {
  const best = [...products].sort((a, b) => b.profit - a.profit)[0];

  const labels: Record<ProductOperation, string> = {
    "home-to-kaspi": "Үйден Kaspi жолына",
    "kaspi-sold": "Kaspi сатылды",
    "home-to-wb": "Үйден WB жолына",
    "wb-received": "WB қоймасына қабылданды",
    "wb-sold": "WB сатылды",
    "china-received": "Қытайдан үйге келді",
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Жалпы пайда"
          value={`${money.format(totalProfit)} ₸`}
          note="Барлық кезең"
        />
        <StatCard
          title={`${new Date().toLocaleDateString("kk-KZ", { month: "long" })} пайдасы`}
          value={`${money.format(currentMonthProfit)} ₸`}
          note={`Жаңа операциялар: ${currentMonthOperationsProfit >= 0 ? "+" : ""}${money.format(currentMonthOperationsProfit)} ₸`}
        />
        <StatCard
          title="Тауар саны"
          value={`${products.length} позиция`}
          note="Белсенді база"
        />
        <StatCard
          title="Ең пайдалы тауар"
          value={best?.code ?? "—"}
          note={best ? `${money.format(best.profit)} ₸` : "Дерек жоқ"}
        />
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">Операциялар тарихы</h3>
            <p className="text-sm text-slate-500">
              Соңғы қозғалыстар мен сатулар
            </p>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Операциялар тарихын толық өшіруге сенімдісіз бе?",
                  )
                ) {
                  onClearHistory();
                }
              }}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            >
              Тарихты тазалау
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Әзірге операция жоқ.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="px-3 py-3">Күні</th>
                  <th className="px-3 py-3">Қайтару</th>
                  <th className="px-3 py-3">Код</th>
                  <th className="px-3 py-3">Тауар</th>
                  <th className="px-3 py-3">Операция</th>
                  <th className="px-3 py-3">Саны</th>
                  <th className="px-3 py-3">Пайда</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-3 py-4 text-slate-500">{item.date}</td>
                    <td className="px-3 py-4">
                      <button
                        type="button"
                        onClick={() => void onUndoOperation(item)}
                        className="whitespace-nowrap rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-white hover:bg-amber-600"
                      >
                        ↩ Қайтару
                      </button>
                    </td>
                    <td className="px-3 py-4 font-bold text-blue-600">
                      {item.code}
                    </td>
                    <td className="px-3 py-4">{item.name}</td>
                    <td className="px-3 py-4">{labels[item.operation]}</td>
                    <td className="px-3 py-4">{item.quantity}</td>
                    <td className="px-3 py-4 font-semibold">
                      {item.profit > 0 ? `${money.format(item.profit)} ₸` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

function Settings({ onReset }: { onReset: () => Promise<void> }) {
  function reset() {
    const confirmed = window.confirm(
      "Барлық өзгерісті өшіріп, бастапқы тауарларды қайтаруға сенімдісіз бе?",
    );
    if (confirmed) onReset();
  }

  return (
    <div className="max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
      <h3 className="text-2xl font-bold">Баптаулар</h3>
      <p className="mt-3 text-slate-500">
        Мәліметтер Supabase бұлттық базасында сақталады және барлық құрылғыда
        бірдей көрінеді.
      </p>

      <button
        onClick={reset}
        className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100"
      >
        Бастапқы базаға қайтару
      </button>
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
}: {
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs text-blue-600">{note}</p>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        min={type === "number" ? 0 : undefined}
        className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ImageUploader({
  image,
  onChange,
}: {
  image: string;
  onChange: (value: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Тек сурет файлын таңдаңыз.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Сурет көлемі 5 МБ-тан аспауы керек.");
      return;
    }

    setUploading(true);

    try {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${uuidv4()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        alert(`Суретті жүктеу қатесі: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Белгісіз қате";
      alert(`Суретті жүктеу қатесі: ${message}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="mb-3 text-sm font-medium">Тауар суреті</p>

      <div className="flex flex-wrap items-center gap-4">
        {image ? (
          <img
            src={image}
            alt="Тауар суреті"
            className="h-24 w-24 rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-400">
            Фото жоқ
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <label
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold text-white ${
              uploading
                ? "cursor-not-allowed bg-slate-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Жүктеліп жатыр..." : "Сурет таңдау"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={selectImage}
              disabled={uploading}
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={uploading}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              Суретті өшіру
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        JPG, PNG немесе WEBP. Ең жоғары көлемі — 5 МБ.
      </p>
    </div>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[95vh] max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-white px-3 py-2 text-sm font-bold shadow"
        >
          ✕
        </button>

        <img
          src={image}
          alt="Үлкейтілген тауар суреті"
          className="max-h-[90vh] max-w-full rounded-2xl bg-white object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}

function EmptyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-slate-500">{text}</p>
    </div>
  );
}
