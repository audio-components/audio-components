import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const ButtonRoot = styled.button`
  outline: none;
  background: none;

  border: 1px solid currentColor;
`

const Button = ({ onClick, children }) => {
  return <ButtonRoot onClick={onClick}>{children}</ButtonRoot>
}

Button.propTypes = {
  onClick: PropTypes.func,
}

Button.defaultProps = {
  onClick: () => {},
}

export default Button
