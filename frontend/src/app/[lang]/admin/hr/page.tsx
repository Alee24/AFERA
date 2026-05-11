"use client";
import React, { useEffect, useState } from 'react';


interface StaffInfo {
  id: string;
  staff_number: string;
  position: string;
  hire_date: string;
  phone?: string;
  address?: string;
  salary?: number;
  User?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  Department?: {
    name: string;
  };
}

export default function HRPage() {
  const [staff, setStaff] = useState<StaffInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch('/api/admin/hr');
        if (!res.ok) throw new Error('Failed to fetch staff');
        const data = await res.json();
        setStaff(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) return <div className="loader">Loading staff information...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <section className="hr-module">
      <h1 className="title">Human Resources – Staff Directory</h1>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Position</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="staff-row">
              <td>{s.User?.first_name} {s.User?.last_name}</td>
              <td>{s.User?.email}</td>
              <td>{s.position}</td>
              <td>{s.Department?.name || '—'}</td>
              <td>{s.phone || '—'}</td>
              <td>{s.address || '—'}</td>
              <td>{s.salary ? `$${Number(s.salary).toFixed(2)}` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .hr-module {
          padding: 2rem;
          background: linear-gradient(135deg, hsl(210, 30%, 96%), hsl(210, 20%, 98%));
          min-height: 80vh;
        }
        .title {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: hsl(210, 50%, 30%);
          text-align: center;
        }
        .staff-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
        }
        .staff-table th {
          background: hsl(210, 30%, 85%);
          color: #222;
          padding: 0.75rem 1rem;
          text-align: left;
          font-weight: 600;
        }
        .staff-row {
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .staff-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        .staff-row td {
          padding: 0.75rem 1rem;
        }
        .loader, .error {
          text-align: center;
          margin-top: 3rem;
          font-size: 1.2rem;
          color: hsl(210, 30%, 40%);
        }
        .error { color: #c00; }
      `}</style>
    </section>
  );
}
