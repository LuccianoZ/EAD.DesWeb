import './FilterBar.css';

export default function FilterBar({ filter, setFilter, counts }) {
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Done' },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
            <span className="filter-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
