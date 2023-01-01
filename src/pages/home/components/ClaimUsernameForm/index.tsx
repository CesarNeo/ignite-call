import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { FunctionComponent } from 'react'
import { Form } from './styles'

export const ClaimUsernameForm: FunctionComponent = () => {
  return (
    <Form as="form">
      <TextInput size="sm" prefix="ignite.com/" placeholder="seu-usuario" />

      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
