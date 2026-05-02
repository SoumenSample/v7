// "use client"

// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import QuotationForm from "@/components/quotationForm"

// export default function QuotationPage() {
//   const [data, setData] = useState([])
//   const [open, setOpen] = useState(false)

//   const loadData = async () => {
//   try {
//     const res = await fetch("/api/quotations")

//     const text = await res.text() // 👈 important

//     try {
//       const data = JSON.parse(text)
//       setData(data.quotations || [])
//     } catch {
//       console.error("Not JSON response:", text)
//     }

//   } catch (err) {
//     console.error(err)
//   }
// }

//   useEffect(() => {
//     loadData()
//   }, [])

//   return (
//     <div className="p-6 space-y-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-xl font-bold">Quotations</h2>
//         <Button onClick={() => setOpen(true)}>
//           Add Quotation
//         </Button>
//       </div>

//       {/* LIST */}
//       <div className="grid gap-4">
//         {data.map((q: any) => (
//           <div key={q._id} className="border p-4 rounded">
//             <h3 className="font-semibold">{q.title}</h3>
//             <p className="text-sm text-muted-foreground">
//               {q.description}
//             </p>

//             {q.fileUrl && (
//               <a
//                 href={q.fileUrl}
//                 target="_blank"
//                 className="text-blue-500 text-sm"
//               >
//                 View Document
//               </a>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* MODAL */}
//       <QuotationForm open={open} setOpen={setOpen} onSuccess={loadData} />
//     </div>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import QuotationForm from "@/components/quotationForm"

export default function QuotationPage() {
  const [data, setData] = useState([])
  const [clients, setClients] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingData, setEditingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [quotRes, clientRes] = await Promise.all([
        fetch("/api/quotations"),
        fetch("/api/users/list")
      ])

      const quotText = await quotRes.text()
      const clientText = await clientRes.text()

      try {
        const quotJson = JSON.parse(quotText)
        setData(quotJson.quotations || [])
      } catch {
        console.error("Failed to parse quotations:", quotText)
      }

      try {
        const clientJson = JSON.parse(clientText)
        // Filter for clients only
        const clientsList = (clientJson.users || []).filter((u: any) => u.role === "client")
        setClients(clientsList)
      } catch {
        console.error("Failed to parse clients:", clientText)
      }
    } catch (err) {
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEditClick = (quotation: any) => {
    setEditingId(quotation._id)
    setEditingData(quotation)
    setOpen(true)
  }

  const handleDeleteClick = async (quotationId: string) => {
    if (!window.confirm("Are you sure you want to delete this quotation?")) {
      return
    }

    setDeleting(true)
    try {
      const res = await fetch(`/api/quotations/${quotationId}`, { method: "DELETE" })
      const result = await res.json()

      if (!res.ok) {
        alert(result.error || "Failed to delete quotation")
        setDeleting(false)
        return
      }

      setData((prev) => prev.filter((q) => q._id !== quotationId))
      alert("Quotation deleted successfully")
    } catch (err) {
      alert(err.message || "An error occurred")
    } finally {
      setDeleting(false)
    }
  }

  const handleCloseModal = () => {
    setOpen(false)
    setEditingId(null)
    setEditingData(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    loadData()
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quotations</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {data.length} quotation{data.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setEditingData(null)
            setOpen(true)
          }}
        >
          + Add Quotation
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            {/* Head */}
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                {["#", "Title", "Client", "Description", "Document", "Actions"].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 bg-gray-50 dark:bg-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                    <p className="text-sm">Loading...</p>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400 dark:text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="9" y1="13" x2="15" y2="13"/>
                        <line x1="9" y1="17" x2="12" y2="17"/>
                      </svg>
                      <span className="text-sm">No quotations yet</span>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((q: any, index: number) => (
                  <tr key={q._id} className="hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">

                    {/* Index */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md
                        bg-gray-100 dark:bg-white/10
                        text-gray-500 dark:text-gray-400">
                        {index + 1}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {q.title || "—"}
                    </td>

                    {/* Client */}
                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {q.recipientUserId?.name || "—"}
                      {q.recipientUserId?.email && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{q.recipientUserId.email}</div>
                      )}
                    </td>

                    {/* Description */}
                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 max-w-sm truncate">
                      {q.description || "—"}
                    </td>

                    {/* Document */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {q.fileUrl ? (
                        <a
                          href={q.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                            border border-gray-200 dark:border-white/10
                            bg-white dark:bg-white/5
                            text-gray-700 dark:text-gray-300
                            hover:border-gray-400 dark:hover:border-white/30
                            hover:text-gray-900 dark:hover:text-white"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                          View Doc
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-700 italic">No file</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(q)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                            border border-gray-200 dark:border-white/10
                            bg-white dark:bg-white/5
                            text-gray-700 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(q._id)}
                          disabled={deleting}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-60
                            border border-red-200 dark:border-red-900/30
                            bg-red-50 dark:bg-red-900/20
                            text-red-700 dark:text-red-400
                            hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {data.length > 0 && (
          <div className="px-5 py-3 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
            Showing {data.length} quotation{data.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <QuotationForm
        open={open}
        setOpen={handleCloseModal}
        onSuccess={handleSuccess}
        quotationId={editingId}
        initialData={editingData}
        clients={clients}
      />
    </div>
  )
}