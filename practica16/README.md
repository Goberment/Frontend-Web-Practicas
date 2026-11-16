# Práctica 16

**Nombre:** Diego Francisco Montes Cruz
**ID:** 252812


## Preguntas

### Ejercicio 1

**¿Por qué se usa un contexto y no props para la sesión?**

Porque la sesión se necesita en diferentes partes de la aplicación, como el encabezado, el inicio de sesión, el registro y otras funciones. Si usáramos props, tendríamos que estar pasando la información por varios componentes, incluso por algunos que ni siquiera la necesitan. Con el contexto podemos acceder a la sesión desde cualquier componente que esté dentro del proveedor, sin tener que pasar tantos datos manualmente.


**¿Qué pasa si un componente usa la sesión fuera del proveedor?**

Si un componente intenta usar la sesión fuera del proveedor, va a recibir un valor null, porque no tiene acceso al contexto. En este caso, el hook useSesion() detecta ese problema y muestra un error indicando que debe utilizarse dentro de ProveedorSesion. Así es más fácil identificar qué está fallando y corregirlo.

### Ejercicio 2

**¿Dónde se guarda el token y qué riesgo tiene ese lugar?**

El token se guarda en el localStorage del navegador junto con los datos del usuario. Esto permite que la sesión siga activa aunque se recargue la página. El problema es que cualquier código JavaScript que se ejecute en la página puede acceder a esa información. Por ejemplo, si existe una vulnerabilidad XSS, alguien podría robar el token y utilizarlo para entrar a la cuenta. Para evitarlo, se pueden utilizar cookies HttpOnly, Secure y SameSite, además de manejar tokens que tengan un tiempo de duración limitado.



