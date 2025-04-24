"use client"
import { useState } from "react";
import { DayPicker } from "react-day-picker";
const orderMeal = () => {
  const [date, setDate] = useState<Date | undefined>();

  return (
    <div>

     <h1 className="text-center text-6xl py-6">Ordered Mill</h1>

     
     <div>
     <button popoverTarget="rdp-popover" className="input input-border" style={{ anchorName: "--rdp" } as React.CSSProperties}>
        {date ? date.toLocaleDateString() : "Pick a date"}
      </button>
      <div popover="auto" id="rdp-popover" className="dropdown" style={{ positionAnchor: "--rdp" } as React.CSSProperties}>
        <DayPicker className="react-day-picker" mode="single" selected={date} onSelect={setDate} />
      </div>
     </div>
    

    </div>
  )
}

export default orderMeal