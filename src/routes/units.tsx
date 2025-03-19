import { createFileRoute } from '@tanstack/react-router'
import UnitsForm from '../components/units-form';

export const Route = createFileRoute('/units')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UnitsForm/>
}
