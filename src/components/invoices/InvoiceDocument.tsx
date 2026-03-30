import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  orgName: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  label: {
    fontSize: 8,
    color: "#888",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: { fontSize: 10, color: "#1a1a1a" },
  metaRight: { alignItems: "flex-end" },
  metaRow: { marginBottom: 8 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0dc",
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0dc",
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f3",
  },
  colDescription: { flex: 3, paddingRight: 8 },
  colQty: { width: 60, textAlign: "right", paddingRight: 8 },
  colUnitPrice: { width: 80, textAlign: "right", paddingRight: 8 },
  colAmount: { width: 80, textAlign: "right" },
  headerText: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#e0e0dc",
  },
  totalLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginRight: 16,
    paddingTop: 2,
  },
  totalAmount: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
  statusBadge: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: "Helvetica-Bold",
  },
});

type Item = {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
};
type Props = {
  invoice: {
    number: string;
    status: string;
    total: number;
    due_date: string | null;
    created_at: string;
  };
  items: Item[];
  orgName: string;
  projectName?: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function InvoiceDocument({
  invoice,
  items,
  orgName,
  projectName,
}: Props) {
  const statusColors: Record<string, string> = {
    draft: "#888",
    sent: "#1a5276",
    paid: "#1e5631",
  };
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.orgName}>{orgName}</Text>
            {projectName && (
              <Text style={[styles.value, { marginTop: 4, color: "#666" }]}>
                Project: {projectName}
              </Text>
            )}
          </View>
          <View style={styles.metaRight}>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Invoice</Text>
              <Text style={styles.value}>{invoice.number}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.label}>Issued</Text>
              <Text style={styles.value}>{formatDate(invoice.created_at)}</Text>
            </View>
            {invoice.due_date && (
              <View style={styles.metaRow}>
                <Text style={styles.label}>Due</Text>
                <Text style={styles.value}>{formatDate(invoice.due_date)}</Text>
              </View>
            )}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusColors[invoice.status] + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: statusColors[invoice.status] },
                ]}
              >
                {invoice.status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colDescription]}>
            Description
          </Text>
          <Text style={[styles.headerText, styles.colQty]}>Qty</Text>
          <Text style={[styles.headerText, styles.colUnitPrice]}>
            Unit price
          </Text>
          <Text style={[styles.headerText, styles.colAmount]}>Amount</Text>
        </View>
        {items.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.value, styles.colDescription]}>
              {item.description}
            </Text>
            <Text style={[styles.value, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.value, styles.colUnitPrice]}>
              {formatCurrency(item.unit_price)}
            </Text>
            <Text style={[styles.value, styles.colAmount]}>
              {formatCurrency(item.quantity * item.unit_price)}
            </Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(invoice.total)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
