import { useState } from "react";
import { Button } from "../ui/button";


export default function Smea({items}: {items: number}) {
  const [item, setItem] = useState(items);
  return (
    <div>
      <Button onClick={() => setItem(item + 1)}>+</Button>
      <p>{item}</p>
    </div>
  )
}