// src/components/Card.jsx
export default function Card({ title, children }){
    return (
      <section className="card">
        {title && <h3 style={{margin:"0 0 8px", color:"#9fb0c3", fontWeight:600}}>{title}</h3>}
        {children}
      </section>
    );
  }
  