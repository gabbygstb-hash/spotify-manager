import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Pop',
    artist: '',
    rating: '',
    label: '',
    role: 'Creator',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title.trim() || formData.title.length < 3) {
      tempErrors.title = 'Title must be at least 3 characters.';
    }
    if (!formData.artist.trim()) {
      tempErrors.artist = 'Artist name is required.';
    }
    const numRating = Number(formData.rating);
    if (!formData.rating || isNaN(numRating) || numRating < 1 || numRating > 100) {
      tempErrors.rating = 'Rating must be 1-100.';
    }
    if (!formData.label.trim()) {
      tempErrors.label = 'Label name is required.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTrack = { id: Date.now(), ...formData, rating: Number(formData.rating) };
    setTracks((prev) => [...prev, newTrack]);
    setFormData({
      title: '',
      genre: 'Pop',
      artist: '',
      rating: '',
      label: '',
      role: 'Creator',
    });
    setErrors({});
    setActiveTab('table');
  };

  const columns = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Artist', accessorKey: 'artist' },
    { header: 'Genre', accessorKey: 'genre' },
    { header: 'Rating/BPM', accessorKey: 'rating' },
    { header: 'Label', accessorKey: 'label' },
    { header: 'Role', accessorKey: 'role' },
  ];

  const table = useReactTable({
    data: tracks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-slate-800 pb-4 text-center">
          <h1 className="text-3xl font-bold text-green-400">Spotify Track & Playlist Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Phase 2: Styled Registry & TanStack Table</p>
          
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                activeTab === 'form' ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Add Track
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded text-sm font-semibold transition ${
                activeTab === 'table' ? 'bg-green-500 text-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Registry Table ({tracks.length})
            </button>
          </div>
        </header>

        {activeTab === 'form' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Register Track</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Track Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-green-400"
                />
                {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-green-400"
                  >
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Indie">Indie</option>
                    <option value="Jazz">Jazz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Artist Name</label>
                  <input
                    type="text"
                    name="artist"
                    value={formData.artist}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-green-400"
                  />
                  {errors.artist && <p className="text-red-400 text-xs mt-1">{errors.artist}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating / BPM (1-100)</label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-green-400"
                  />
                  {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Record Label</label>
                  <input
                    type="text"
                    name="label"
                    value={formData.label}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-green-400"
                  />
                  {errors.label && <p className="text-red-400 text-xs mt-1">{errors.label}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">User Role</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Creator"
                      checked={formData.role === 'Creator'}
                      onChange={handleChange}
                      className="accent-green-500"
                    />
                    Creator
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="Listener"
                      checked={formData.role === 'Listener'}
                      onChange={handleChange}
                      className="accent-green-500"
                    />
                    Listener
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold py-2 rounded transition"
              >
                Add Track
              </button>
            </form>
          </section>
        )}

        {activeTab === 'table' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Track Registry Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-3 border-b border-slate-700">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedTrack(row.original)}
                        className={`border-b border-slate-700 cursor-pointer transition ${
                          selectedTrack?.id === row.original.id
                            ? 'bg-slate-700 text-green-400'
                            : 'hover:bg-slate-700/50'
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="text-center p-4 text-slate-500">
                        No tracks added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-xs text-slate-400">
              <div>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        )}

        {selectedTrack && activeTab === 'table' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-green-500 shadow-md">
            <h2 className="text-xl font-semibold text-green-400 mb-2">Active Track Details</h2>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
              <p><strong>Title:</strong> {selectedTrack.title}</p>
              <p><strong>Artist:</strong> {selectedTrack.artist}</p>
              <p><strong>Genre:</strong> {selectedTrack.genre}</p>
              <p><strong>Rating/BPM:</strong> {selectedTrack.rating}</p>
              <p><strong>Label:</strong> {selectedTrack.label}</p>
              <p><strong>Role:</strong> {selectedTrack.role}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}