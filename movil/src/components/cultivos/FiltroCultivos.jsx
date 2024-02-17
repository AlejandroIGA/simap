import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import theme from '../../theme';

const FiltroCultivos = ({ onFilter }) => {
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    onFilter(filtro); // Llama a la función de filtro al montar el componente para mostrar todos los elementos por defecto
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleChange = texto => {
    setFiltro(texto);
    onFilter(texto);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese nombre de cultivo"
        onChangeText={handleChange}
        value={filtro}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom:10,
    marginHorizontal: 20,
  },
  input: {
    borderWidth: 3,
    borderColor: theme.colors.background,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});

export default FiltroCultivos;
