import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-6">Welcome to Paytm Clone</h2>
      <div className="flex space-x-4">
        <a href="/signin" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Login</a>
        <a href="/signup" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Sign Up</a>
      </div>
    </div>
  );
};

export default Home;
