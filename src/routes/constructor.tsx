import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/constructor')({
  component: Constructor,
})

function Constructor() {
  return <div>Hello "/constructor"!</div>
}
