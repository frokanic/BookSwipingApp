package com.example.expresstrainingsecond.presentation.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.example.expresstrainingsecond.R
import com.example.expresstrainingsecond.databinding.FragmentSideMenuContentsBinding
import com.example.expresstrainingsecond.databinding.FragmentSideMenuPagesBinding

class SideMenuPagesFragment : Fragment() {

    private lateinit var binding: FragmentSideMenuPagesBinding

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentSideMenuPagesBinding.inflate(inflater, container, false)
        return binding.root
    }

}