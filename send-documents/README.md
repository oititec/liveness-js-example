# Este documento trata com detalhes a implementação do SDK da FaceTec no exemplo em JavaScript relacionado ao Envio de Documentos.

## 1 - Informações da home

Ao abrir o endereço onde os arquivos deste projeto foram publicados no seu navegador web, você cairá na tela abaixo:
<br>
![image.png](https://i.ibb.co/7nscwCZ/Screenshot-2023-04-20-at-17-23-34-React-App.png)

Copie e cole uma appkey válida e pressione o botão continuar

Você será direcionado para a tela abaixo:
<br>
![image.png](https://i.ibb.co/gmdmHsY/Screenshot-2023-04-20-at-17-25-46-React-App.png)

Você terá 3 itens no menu:

- [Liveness 2D](https://github.com/oititec/liveness-js-example/blob/main/liveness-2d/README.md)
- [Liveness 3D](https://github.com/oititec/liveness-js-example/blob/main/liveness-3d/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-js-example/blob/main/send-documents/README.md) - Este último só estará disponível ao finalizar um do processos de Liveness

Realize um processo de Liveness (seja ele 2D ou 3D) para que a appkey seja registrada com seubotão devido processo de Liveness. Retorne para a home e verá que o botão de Envio de documentos estará habilitado.
Print da home com botão de envio de documentos habilitado

## 2 - Envio de documentos

<br>
![image](https://i.ibb.co/xJZPyxb/image.png)

Nesta tela o usuário deverá o tipo de documento que ele vai enviar:

- Documento em uma única foto (foto única contendo a frente e o verso do documento. ex: CNH)
- Documento em duas fotos (frente e verso do documento. Ex: Qualquer documento que não seja possível enviar a frente e o verso em uma única foto)
- QRCode da CNH Digital via foto ou um arquivo no formato PDF, JPEG ou PNG

Ao carregar a tela de Envio de documentos (foto única/frente e verso), os seguintes métodos são executados:
<br>
| Método | Descrição |
|-|-|
| onResize() | Verifica a resolução de tela do dispositivo do usuário e inicia a câmera |
| startCamera() | Responsável por iniciar a câmera do dispositivo do usuário |
| handleStream() | Responsável por exibir na tag `<video>` do HTML5 o vídeo da câmera do dispositivo do usuário |
| stopCameraStreams() | Interrompe a execução da câmera do dispositivo após a imagem ser capturada |
| setTypeCapture() | Responsável por armazenar se o documento enviado será em uma única foto (frente e verso) ou 2 fotos (uma para a frente do documento e outra para o verso) |

![image](https://i.ibb.co/VxTckWz/image.png)

Ao chegar na tela acima, o processo da captura da imagem do documento do usuário poderá ser iniciada ao clicar no botão "Tirar foto". Esse botão chama os métodos abaixo:
| Método | Descrição |
|-|-|
| startCapture() | Inicia a captura da imagem e após a captura, chama o método `stopCameraStreams()` |
| snapCapture() | Retorna guarda o retorno do método `snap()` no state `snapTempDom` |
| snap() | Exibe a imagem capturada da tav `video` como se fosse uma foto para o usuário usando a tag `canvas` do HTML5 |

![image](https://i.ibb.co/GxKs5Yc/image.png)

Após a captura da imagem ser finalizada, o usuário verá uma tela contendo a imagem capturada e dois botões `Usar foto` e `Tirar nova foto`.

Ao clicar no botão `Usar foto` os métodos abaixo são chamados:
| Método | Descrição |
|-|-|
| snapTick() | Prepara a captura da imagem e as armazena em uma lista |
| tempSnap() | Limpa a lista de imagens |
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Ao clicar no botão `Tirar nova foto` os métodos abaixo são chamados:
| Método | Descrição |
|-|-|
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Após o usuário clicar no botão `Usar foto`, ele é direcionado para uma tela onde ele pode enviar ou trocar a imagem do documento.

![image](https://i.ibb.co/dG8t7qs/image.png)

Ao clicar no botão "Trocar foto", são chamados os seguintes métodos:
| Método | Descrição |
|-|-|
| removeSnapFromLists() | Remove todas as imagens da lista de envio |
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Ao clicar no botão `Enviar foto` ou `Enviar fotos`, é chamado o seguinte método:
| Método | Descrição |
|-|-|
| uploadPictures() | Método assíncrono que fará o envio das imagens do documento do usuário |

Caso o envio seja feito com sucesso, o usuário verá a mensagem `Documento enviado com sucesso`

![image](https://i.ibb.co/Bsj6tD6/image.png)

Em caso de problemas com a identificação do documento, a mensagem `Documento não localizado! Por favor reenvie o documento.` será exibida na tela

![image](https://i.ibb.co/thqLHp8/image.png)

Para envio da CNH Digital (via foto), os seguintes métodos são executados:
<br>
| Método | Descrição |
|-|-|
| onResize() | Verifica a resolução de tela do dispositivo do usuário e inicia a câmera |
| startCamera() | Responsável por iniciar a câmera do dispositivo do usuário |
| handleStream() | Responsável por exibir na tag `<video>` do HTML5 o vídeo da câmera do dispositivo do usuário |
| stopCameraStreams() | Interrompe a execução da câmera do dispositivo após a imagem ser capturada |
| setTypeCapture() | Responsável por armazenar se o documento enviado será em uma única foto, neste caso apenas uma foto

![image](https://i.ibb.co/VxTckWz/image.png)

Ao chegar na tela acima, o processo da captura da imagem do documento do usuário poderá ser iniciada ao clicar no botão "Tirar foto". Esse botão chama os métodos abaixo:
| Método | Descrição |
|-|-|
| startCapture() | Inicia a captura da imagem e após a captura, chama o método `stopCameraStreams()` |
| snapCapture() | Retorna guarda o retorno do método `snap()` no state `snapTempDom` |
| snap() | Exibe a imagem capturada da tav `video` como se fosse uma foto para o usuário usando a tag `canvas` do HTML5 |

![image](https://i.ibb.co/GxKs5Yc/image.png)

Após a captura da imagem ser finalizada, o usuário verá uma tela contendo a imagem capturada e dois botões `Usar foto` e `Tirar nova foto`.

Ao clicar no botão `Usar foto` os métodos abaixo são chamados:
| Método | Descrição |
|-|-|
| snapTick() | Prepara a captura da imagem e as armazena em uma lista |
| tempSnap() | Limpa a lista de imagens |
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Ao clicar no botão `Tirar nova foto` os métodos abaixo são chamados:
| Método | Descrição |
|-|-|
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Após o usuário clicar no botão `Usar foto`, ele é direcionado para uma tela onde ele pode enviar ou trocar a imagem do documento.

![image](https://i.ibb.co/dG8t7qs/image.png)

Ao clicar no botão "Trocar foto", são chamados os seguintes métodos:
| Método | Descrição |
|-|-|
| removeSnapFromLists() | Remove todas as imagens da lista de envio |
| resetSnap() | Método responsável por reiniciar a câmera do dispositivo do usuário para fazer uma nova captura de documento |

Ao clicar no botão `Enviar foto`, é chamado o seguinte método:
| Método | Descrição |
|-|-|
| sendDigitalCNH() | Método assíncrono que fará o envio do QRCode do usuário |

Caso o envio seja feito com sucesso, o usuário verá a mensagem `QRCode enviado com sucesso`

Em caso de problemas com a identificação do documento, a mensagem `QRCode não localizado! Por favor reenvie o documento` será exibida na tela

![image](https://i.ibb.co/thqLHp8/image.png)

Para envio da CNH Digital (via arquivo), os seguintes métodos são executados:
<br>
| Método | Descrição |
|-|-|
| triggerFileInput() | Aciona o evento de upload de arquivo para o usuário |
| onFileSelected() | Valida se o formato do arquivo carregado é suportado |
| convertToBase64() | Converte o arquivo carregado em base64 |

![image](https://i.ibb.co/VxTckWz/image.png)

Após o arquivo ser carregado, usuário verá um ícone correspondendo ao tipo do arquivo e dois botões `Enviar arquivo` e uma lixeira para excluí-lo.

Ao clicar no botão `Enviar arquivo`, é chamado o seguinte método:
| Método | Descrição |
|-|-|
| sendDigitalCNH() | Método assíncrono que fará o envio do QRCode do usuário |

Caso o envio seja feito com sucesso, o usuário verá a mensagem `QRCode enviado com sucesso`

Em caso de problemas com a identificação do documento, a mensagem `QRCode não localizado! Por favor reenvie o documento` será exibida na tela

![image](https://i.ibb.co/thqLHp8/image.png)

Ao clicar no botão da lixeira, é chamado o seguinte método:
| Método | Descrição |
|-|-|
| removeLoadedFile() | Remove o arquivo carregado|
