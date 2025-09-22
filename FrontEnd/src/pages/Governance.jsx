import React, { useEffect, useState } from 'react'
import { faGavel, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
import { useNavigate, useParams } from 'react-router-dom'
import { governanceItemsAPI } from "../services/api"

function Governance() {
  const { id } = useParams();
  const [governanceItems, setGovernanceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(0);
  const [notApproved, setNotApproved] = useState(0);
  const navigate = useNavigate();

  // Fetch governance items from API
  useEffect(() => {
    const fetchGovernanceItems = async () => {
      try {
        setLoading(true);
        const data = await governanceItemsAPI.getAll();
        setGovernanceItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch governance items');
        console.error('Error fetching governance items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGovernanceItems();
  }, []);

  // Calculate stats when data changes
  useEffect(() => {
    if (governanceItems.length === 0) return;

    let newActive = 0;
    let newNotApproved = 0;

    governanceItems.forEach(item => {
      if (item.approval_status !== "approved") {
        newNotApproved++;
      }
      if (item.status === "active") {
        newActive++;
      }
    });

    setActive(newActive);
    setNotApproved(newNotApproved);
  }, [governanceItems]);

  const deleteGovernance = async (governanceId) => {
    if (window.confirm('Are you sure you want to delete this governance item?')) {
      try {
        await governanceItemsAPI.delete(governanceId);
        setGovernanceItems(prev => prev.filter(item => item.governance_id !== governanceId));
      } catch (err) {
        console.error('Error deleting governance item:', err);
        alert('Failed to delete governance item');
      }
    }
  };

  // Prepare data for CardSlider
  const fields = governanceItems.map((item, index) => [
    { type: "t", text: index + 1 },
    { type: "t", text: item.governance_name },
    { type: "t", text: item.type },
    { type: "t", text: item.owner || "Unassigned" },
    { 
      type: "b", 
      text: item.status,
      color: item.status === "active" 
        ? "#00ff0099" 
        : item.status === "draft"
        ? "#FFA72699"
        : "#3b82f699"
    },
    { type: "t", text: item.last_reviewed ? new Date(item.last_reviewed).toLocaleDateString() : "Never" },
    { type: "t", text: item.effective_date ? new Date(item.effective_date).toLocaleDateString() : "N/A" },
    { type: "t", text: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "N/A" },
    { type: "t", text: item.next_review ? new Date(item.next_review).toLocaleDateString() : "N/A" },
    { type: "t", text: "-" }, // Version (not in schema)
    { type: "t", text: item.latest_change_summary || "No changes" },
    { 
      type: "b", 
      text: item.approval_status,
      color: item.approval_status === "approved" 
        ? "#00ff0099" 
        : item.approval_status === "pending"
        ? "#FFA72699"
        : "#ff000099"
    },
    { type: "t", text: item.approver || "N/A" },
    { type: "t", text: "N/A" }, // Confidentiality (not in schema)
    { type: "t", text: item.attachment ? "Has attachment" : "No file" },
    { type: "i", text: "faPen", color: "#26A7F6", selfNav: "/dashboard/editGovernance/" + item.governance_id },
    { type: "i", text: "faTrash", color: "#F44336", click: () => { deleteGovernance(item.governance_id) } }
  ]);

  const ids = governanceItems.map(item => item.governance_id);
  const colors = governanceItems.map(item => 
    String(item.governance_id) === id ? "#26A7F680" : ""
  );

  // Calculate expiring soon items
  const expiringSoon = governanceItems.filter(item => {
    if (!item.expiry_date) return false;
    
    const expiry = new Date(item.expiry_date);
    const now = new Date();
    
    const expiryYear = expiry.getFullYear();
    const expiryMonth = expiry.getMonth();
    
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    
    // Check if expiry is in this month
    const isThisMonth = expiryYear === currentYear && expiryMonth === currentMonth;
    
    // Check if expiry is in next month (handles year change too)
    const nextMonth = (currentMonth + 1) % 12;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    const isNextMonth = expiryYear === nextMonthYear && expiryMonth === nextMonth;
    
    return isThisMonth || isNextMonth;
  }).length;

  if (loading) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
        <div className="p-4">Loading governance items...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
        <div className="p-4 text-red-500">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
      <div className='cardsContainer'>
        <Card title="Total Documents" value={governanceItems.length} model={1} />
        <Card title="Active" value={active} model={2} />
        <Card title="Expiring Soon" value={expiringSoon} model={1} />
        <Card title="Pending Approval" value={notApproved} model={2} />
      </div>
      <div className='h2AndButtonContainer '>
        <h2>Governance Items</h2>
        <div className='button buttonStyle' onClick={() => { navigate("/dashboard/addGovernance") }}>
          <FontAwesomeIcon icon={faPlus} className=' mr-1' />
          Add Item
        </div >
      </div>
      <CardSlider
        titles={["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Approver", "Confidentiality", "Attachment", "Actions", ""]}
        sizes={[1, 4, 3, 3, 4, 4, 4, 4, 4, 3, 7, 4, 4, 4, 4, 2, 2]}
        colors={colors}
        fields={fields}
        ids={ids}
      />
    </>
  )
}

export default Governance