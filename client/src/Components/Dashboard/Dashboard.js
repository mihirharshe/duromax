import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import { Login } from '../Auth/Login';
import RequireAuth from '../Auth/RequireAuth';
import Unauthorized from '../Auth/Unauthorized';
import PersistLogin from '../Auth/PersistLogin';

const Dashboard = () => {
	return (
		<div>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/unauthorized" element={<Unauthorized />} />
				<Route element={<PersistLogin />}>
					<Route element={<RequireAuth allowedRoles={['User']} />}>
						<Route path="/*" element={<Navbar />} />
					</Route>
				</Route>
			</Routes>
		</div>
	)
}

export default Dashboard