import {BrowserRouter, Route, Routes } from "react-router-dom"
import Watch from "../pages/Watch"
export default function Router(){
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/watch/:id" element={<Watch />} />
        </Routes>
        </BrowserRouter>
    )
}